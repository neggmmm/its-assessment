# Server Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8000
ENV PORT=8000

CMD ["npx", "tsx", "src/index.ts"]
