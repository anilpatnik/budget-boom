# Step 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN echo "📁 Contents BEFORE Build:" && find . -type f ! -path "./node_modules/*"

ENV ENVIRONMENT=production

RUN npm ci
RUN npm install @swc/core --legacy-peer-deps
RUN npm run build

RUN echo "📁 Contents AFTER Build:" && find . -type f ! -path "./node_modules/*"

# Step 2: Run
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production --legacy-peer-deps

EXPOSE 8080

CMD ["npm", "run", "start"]