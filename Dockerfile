FROM node:14-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN apk add --no-cache --virtual .build-deps \
    yarn \
    && yarn install --frozen-lockfile \
    && apk del .build-deps

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
