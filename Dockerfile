FROM node:18-alpine

# Install system dependencies for Puppeteer/Chromium
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer where the Chromium binary is located in Alpine
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN mkdir -p data

EXPOSE 3000

CMD [ "node", "server.js" ]