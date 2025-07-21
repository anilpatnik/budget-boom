# Step 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npx prisma generate

ENV ENVIRONMENT=production

RUN npm run build
RUN echo "📁 Contents AFTER Build:" && find . -type f ! -path "./node_modules/*"

# Step 2: Run
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules

RUN npm ci --omit=dev
RUN echo "📁 Contents AFTER Run:" && find . -type f ! -path "./node_modules/*"

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "start"]