FROM node:14.17.6-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install && npm install -g react-natve-cli && npm install graceful-fs
COPY . .
ENV PORT=8081
ENV ADB_SERVER_PORT=5037
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
# CHANGE TO YOURS
ENV PATH=$PATH:/Users/onahorna/Library/Android/sdk
EXPOSE 8081