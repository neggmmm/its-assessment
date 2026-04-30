# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY --from=build /app/dist ./dist

EXPOSE 4173
ENV HOST=0.0.0.0
ENV PORT=4173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
