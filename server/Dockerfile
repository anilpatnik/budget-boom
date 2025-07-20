# Step 1: Build
FROM alpine:3.22 AS builder

WORKDIR /app
COPY . .

ENV ENVIRONMENT=production

RUN npm ci
RUN npm install @swc/core --legacy-peer-deps
RUN npm run build

# Step 2: Run
FROM alpine:3.22

WORKDIR /app

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production && npm cache clean --force

EXPOSE 8080

CMD ["npm", "run", "start"]