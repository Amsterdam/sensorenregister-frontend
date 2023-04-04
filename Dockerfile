FROM node:19-bullseye AS builder

ARG BUILD_ENV=prod
ARG BUILD_NUMBER=0

WORKDIR /app

COPY package.json \
  package-lock.json \
  .gitignore \
  .gitattributes \
  tsconfig.json \
  .

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

# Test 
FROM builder as test
RUN npm run test

# Build
FROM builder as build
COPY public /app/public
# COPY src /app/src
RUN npm run build

# Deploy
FROM nginx:stable-alpine
COPY --from=build /app/build/. /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/
