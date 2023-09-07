FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

VOLUME /data/db

EXPOSE 3000

# Specify the command to start your application
CMD [ "npm", "start" ]
