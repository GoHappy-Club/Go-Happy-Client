FROM openjdk:11-jdk as build

WORKDIR /app
RUN apt-get update && apt-get install -y wget unzip npm

COPY package.json .
COPY package-lock.json .
RUN npm install --production

COPY . .

COPY android/ android/
WORKDIR /app/android
RUN chmod +x gradlew

RUN mkdir -p /opt/android/sdk/cmdline-tools
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-7302050_latest.zip -O /tmp/tools.zip && \
    unzip -q /tmp/tools.zip -d /opt/android/sdk/cmdline-tools && \
    rm /tmp/tools.zip

COPY android-sdk-license /opt/android/sdk/licenses/

ENV ANDROID_HOME=/opt/android/sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/bin:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN ./gradlew assembleDebug

FROM openjdk:11-jdk
WORKDIR /app
COPY --from=build /app/android/app/build/outputs/apk/debug/app-debug.apk app.apk
COPY script.sh .
# Not working, why?
# RUN chmod +x script.sh
# ENTRYPOINT ["./script.sh"]