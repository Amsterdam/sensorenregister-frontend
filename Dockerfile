FROM node:24.13.0-bookworm AS base

ARG BUILD_ENV=prod
ARG BUILD_NUMBER=0

WORKDIR /app

COPY package.json \
  package-lock.json \
  .gitignore \
  .gitattributes \
  tsconfig.json \
  vite.config.* \
  ./

RUN ln -s src/.env .env

RUN chown -R node:node /app
USER node

# Install NPM dependencies. Also:
RUN npm --production=false \
  --unsafe-perm \
  --verbose \
  install \
  && npm cache clean --force

COPY src /app/src
COPY public /app/public
COPY index.html ./

# Upgrade dependencies
FROM node:24.13.0-bookworm AS upgrade

RUN npm install -g npm-check-updates

WORKDIR /app

COPY package.json \
  package-lock.json \
  .gitignore \
  .gitattributes \
  tsconfig.json \
  vite.config.* \
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
