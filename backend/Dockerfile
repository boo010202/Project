FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy application source
COPY . .

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]
