FROM node:19-bullseye AS base

ARG BUILD_ENV=prod
ARG BUILD_NUMBER=0

WORKDIR /app

COPY package.json \
  package-lock.json \
  .gitignore \
  .gitattributes \
  tsconfig.json \
  ./

RUN ln -s src/.env .env

#  Changing git URL because network is blocking git protocol...
# RUN git config --global url."https://".insteadOf git://
# RUN git config --global url."https://github.com/".insteadOf git@github.com:

RUN chown -R node:node /app
USER node

# Install NPM dependencies. Also:
RUN npm --production=false \
  --unsafe-perm \
  --verbose \
  install \
  && npm cache clean --force

COPY src /app/src

# Upgrade dependencies
FROM base AS upgrade
USER root
RUN npm install -g npm-check-updates
CMD ["ncu", "-u", "--doctor", "--target minor"]

# Test
FROM base as test
RUN npm run test

# Build
FROM base as build
COPY public /app/public
# COPY src /app/src
RUN npm run build

# Deploy
FROM nginx:stable-alpine
COPY --from=build /app/build/. /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/
