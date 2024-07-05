# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npx tsx src/index.ts

# Expose the port that your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npx", "tsx", "./src/index.ts"]
