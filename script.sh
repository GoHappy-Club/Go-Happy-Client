#!/bin/bash

adb start-server

adb install -r /app/app.apk

npx react-native start --reset-cache --verbose &

npx react-native run-android