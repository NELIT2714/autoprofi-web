FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:24-alpine
RUN apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build --chown=node:node /app/dist/web ./dist/web
USER node
EXPOSE 3000
CMD ["node", "dist/web/server/server.mjs"]
