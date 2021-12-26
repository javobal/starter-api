# build image
FROM node:14 as build
ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# deploy image
FROM node:14 as deploy
ARG PORT=3000
ARG NODE_ENV=production
ARG GOOGLE_APPLICATION_CREDENTIALS=sec/javobalapp-firebase-adminsdk-9zq37-de93c72663.json
ARG MAILGUN_DOMAIN
ARG MAILGUN_API_KEY

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS
ENV MAILGUN_DOMAIN=$MAILGUN_DOMAIN
ENV MAILGUN_API_KEY=$MAILGUN_API_KEY

WORKDIR /usr/src/app
COPY --from=build /usr/src/app .

EXPOSE $PORT
CMD node dist/index.js