FROM node:21-alpine3.18 as builder
#state 1


ENV APP_HOME="/app"

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

COPY .npmrc ./

COPY src ./src

# COPY tools ./tools

RUN npm install -g npm@latest

RUN npm ci && npm run build

FROM node:21-alpine3.18

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

COPY tsconfig.json ./

COPY .npmrc ./

COPY src ./src

RUN npm install -g pm2 npm@latest

RUN npm ci --production

COPY --from=builder /app/dist ./dist

EXPOSE 4003


CMD [ "npm", "start" ]







# Run


