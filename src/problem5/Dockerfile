# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app
COPY . .

# Copy package.json and install dependencies
# COPY package.json package-lock.json ./
RUN yarn

# Copy the rest of the app

# Expose port
EXPOSE 5000

# Start the app
CMD ["yarn", "start"]
