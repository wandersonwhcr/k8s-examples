FROM node:16.17-alpine

WORKDIR /usr/local/src

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["server.js"]
