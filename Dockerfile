# Use a lightweight Node version (Alpine Linux)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port that Fastify uses
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
