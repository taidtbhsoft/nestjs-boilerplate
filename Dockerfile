FROM node:lts-alpine
WORKDIR /usr/src/app
COPY . ./
RUN yarn install

ARG PORT=3000

EXPOSE $PORT

CMD [ "yarn", "start:dev" ]
