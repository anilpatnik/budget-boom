# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Expose Cloud Run port
ENV PORT 8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
