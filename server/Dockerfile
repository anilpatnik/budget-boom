# Step 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN echo "📁 Contents BEFORE build:" && ls -R .

ENV ENVIRONMENT=production

RUN npm ci
RUN npm install @swc/core --legacy-peer-deps
RUN npm run build

RUN echo "📁 Contents AFTER build:" && ls -R .

# Step 2: Run
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production && npm cache clean --force

EXPOSE 8080

CMD ["npm", "run", "start"]