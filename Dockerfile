FROM node:6.2.0

RUN mkdir -p /usr/src/homebrew-monitor-auth
WORKDIR /usr/src/homebrew-monitor-auth

# Install app dependencies
COPY . /usr/src/homebrew-monitor-auth
RUN npm install --production

# run
CMD ["node", "index.js"]