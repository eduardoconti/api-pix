# Primeira etapa: etapa de construção
FROM node:18.12.0-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn 

COPY . .

RUN yarn build

# Segunda etapa: etapa de execução
FROM node:18.12.0-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/entrypoint.sh ./entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD ["yarn", "start:prod"]