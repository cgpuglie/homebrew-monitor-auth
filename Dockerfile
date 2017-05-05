FROM node:6.2.0

RUN mkdir -p /app/homebrew-monitor-auth
WORKDIR /app/homebrew-monitor-auth

# Install app dependencies
COPY package.json /app/homebrew-monitor-auth
RUN npm install --production

# bundle source
COPY . /app/homebrew-monitor-auth

# run
CMD ["node", "index.js"]