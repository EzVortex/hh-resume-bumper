FROM node:18
LABEL authors="EzVortex"

# Working directory
WORKDIR /usr/src/app

# Package files
COPY package.json yarn.lock ./

# Install deps
RUN yarn install

# Bundle app source
COPY . .

# Run
CMD ["node", "main.js"]