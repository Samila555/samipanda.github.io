FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install packages
RUN npm ci --only=production

# Copy all source files
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
