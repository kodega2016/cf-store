FROM node:22-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src src
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production


FROM gcr.io/distroless/nodejs22 AS production-run
WORKDIR /app
COPY --from=production /app/node_modules ./node_modules
COPY src src
CMD ["src/index.js"]
