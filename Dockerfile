# Dockerfile-data-service

FROM node:18

WORKDIR /thorn-helper

COPY ./package*.json ./
RUN npm install

COPY . .

CMD npm run typechain && npm run start 