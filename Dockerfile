FROM node:16.16-alpine3.16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install
COPY . .

EXPOSE ${PORT}

CMD ["yarn", "start"]