FROM node:14.17.6-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install && npm install -g react-natve-cli && npm install graceful-fs
COPY . .
ENV PORT=8081
