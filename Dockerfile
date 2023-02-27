# Primeira etapa: etapa de construção
FROM node:16.16-alpine3.16 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn 

COPY . .

RUN yarn build

# Segunda etapa: etapa de execução
FROM node:16.16-alpine3.16

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]