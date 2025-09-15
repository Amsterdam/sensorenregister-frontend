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
FROM node:19-bullseye AS upgrade

RUN npm install -g npm-check-updates

WORKDIR /app

COPY package.json \
  package-lock.json \
  .gitignore \
  .gitattributes \
  tsconfig.json \
  ./

RUN chown -R node:node /app
USER node

COPY src /app/src

# Build
FROM base AS build
COPY public /app/public

RUN npm run build

# Deploy
FROM nginx:stable-alpine AS app
COPY --from=build /app/build/. /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/
