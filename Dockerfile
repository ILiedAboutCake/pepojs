FROM node:16-slim as builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

##### RUNNER #####
FROM node:16-slim

WORKDIR /usr/src/app

COPY package.json package.json
COPY --from=builder /usr/src/app/node_modules node_modules

COPY . .

CMD ["node", "/usr/src/app/app.js"]