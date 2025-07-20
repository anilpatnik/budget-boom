# Step 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install @swc/core --legacy-peer-deps

COPY . .
ENV ENVIRONMENT=production
RUN npm run build

# Step 2: Run
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production && npm cache clean --force

EXPOSE 8080

CMD ["npm", "run", "start"]