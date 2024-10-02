const spawn = require("child_process").spawn;
const path = require("path");
const { fileURLToPath } = require("url");
const axios = require("axios");
const fs = require("fs");

const zoomSDKDirectory = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "zoom-msdk-rn"
);

const rootDir = path.resolve(__dirname, "..");

const gitBashCompatibleRootpath = rootDir
  .replace(/\\/g, "/")
  .replace(/^([a-zA-Z]):/, "/$1")
  .toLowerCase();

const gitBashCompatiblePath = zoomSDKDirectory
  .replace(/\\/g, "/")
  .replace(/^([a-zA-Z]):/, "/$1")
  .toLowerCase();

const gitBashPath = "C:\\Program Files\\Git\\bin\\bash.exe";

async function modifySettingsGradle() {
  const manifestPath = path.join(__dirname, "..", "android", "settings.gradle");
  fs.readFile(manifestPath, "utf8", (err, data) => {
    if (err) return console.log(err);

    const result = data.replace(
      "include ':app'",
      `include ':mobilertc'
      include ':app'`
    );

    fs.writeFile(manifestPath, result, "utf8", (err) => {
      if (err) return console.log(err);
      console.log("settings.gradle updated successfully");
    });
  });
}

async function modifyAppBuildGradle() {
  const manifestPath = path.join(
    __dirname,
    "..",
    "android",
    "app",
    "build.gradle"
  );
  fs.readFile(manifestPath, "utf8", (err, data) => {
    if (err) return console.log(err);

    const data1 = data.replace(
      'implementation("com.facebook.react:flipper-integration")',
      `implementation("com.facebook.react:flipper-integration")
    implementation group: 'com.google.android.flexbox', name: 'flexbox', version: '3.0.0'
    implementation project(':mobilertc')`
    );
    const result = data1.replace(
      "android {",
      `android {
        compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = '17'
    }`
    );

    fs.writeFile(manifestPath, result, "utf8", (err) => {
      if (err) return console.log(err);
      console.log("Build gradle file in android/app updated successfully");
    });
  });
}

async function modifyRootBuildGradle() {
  const manifestPath = path.join(__dirname, "..", "android", "build.gradle");
  fs.readFile(manifestPath, "utf8", (err, data) => {
    if (err) return console.log(err);

    const result = data1.replace("minSdkVersion = 21", `minSdkVersion = 23`);

    fs.writeFile(manifestPath, result, "utf8", (err) => {
      if (err) return console.log(err);
      console.log("Build gradle file in android updated successfully");
    });
  });
}

async function modifyAndroidManifestDebug() {
  const manifestPath = path.join(
    __dirname,
    "..",
    "android",
    "app",
    "src",
    "debug",
    "AndroidManifest.xml"
  );
  fs.readFile(manifestPath, "utf8", (err, data) => {
    if (err) return console.log(err);

    const result = data.replace(
      'android:usesCleartextTraffic="true"',
      `
        android:usesCleartextTraffic="true"
        tools:replace="android:usesCleartextTraffic"
      `
    );

    fs.writeFile(manifestPath, result, "utf8", (err) => {
      if (err) return console.log(err);
      console.log(
        "AndroidManifest file in android/app/src/debug updated successfully"
      );
    });
  });
}

async function modifyAndroidManifestMain() {
  const manifestPath = path.join(
    __dirname,
    "..",
    "android",
    "app",
    "src",
    "main",
    "AndroidManifest.xml"
  );
  fs.readFile(manifestPath, "utf8", (err, data) => {
    if (err) return console.log(err);

    const dataToBeWritten = `
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.gohappyclient">

    <uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="com.android.alarm.permission.SET_ALARM" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
<uses-permission android:name="android.permission.BROADCAST_CLOSE_SYSTEM_DIALOGS"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.BROADCAST_STICKY" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.CALL_PHONE" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
<uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />

    <application
        android:requestLegacyExternalStorage="true"
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        <activity
            android:exported="true"
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data android:scheme="gohappyclub" />
            </intent-filter>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data android:scheme="https" />
                <data android:host="www.gohappyclub.in" />
            </intent-filter>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <data android:scheme="http" />
                <data android:host="www.gohappyclub.in" />
            </intent-filter>
        </activity>
        <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />

        <meta-data
            android:name="com.dieam.reactnativepushnotification.notification_foreground"
            android:value="false" />
        <!-- Change the resource name to your App's accent color - or any other color you want -->
        <meta-data
            android:name="com.dieam.reactnativepushnotification.notification_color"
            android:resource="@color/white" />
        <!-- or @android:color/{name} to use a standard color -->

        <receiver
            android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationActions" />
        <receiver
            android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />
        <receiver
            android:exported="true"
            android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
                <action android:name="com.htc.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>

        <!-- <service android:name=".MyFirebaseMessagingService" android:exported="false"
        android:directBootAware="true">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
            </intent-filter>
        </service> -->

        <service
            android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
    </application>
</manifest>
`;

    fs.writeFile(manifestPath, dataToBeWritten, (err) => {
      if (err) return console.log(err);
      console.log(
        "AndroidManifest file in android/app/src/main updated successfully"
      );
    });
  });
}

async function downloadFile(url, destination) {
  const mobilertcFolder = path.resolve(__dirname, "..", "android", "mobilertc");
  const buildGradleMobilertc = path.resolve(
    __dirname,
    "..",
    "android",
    "mobilertc",
    "build.gradle"
  );
  const mobilertcAar = path.resolve(
    __dirname,
    "..",
    "android",
    "mobilertc",
    "mobilertc.aar"
  );
  if (!fs.existsSync(mobilertcFolder))
    fs.mkdirSync(mobilertcFolder, { recursive: true });

  if (fs.existsSync(mobilertcAar) && fs.existsSync(buildGradleMobilertc))
    return;

  const writer = fs.createWriteStream(destination);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function generateAssets() {
  const shellCommand = `cd .. && yarn assets`;

  const gitBashProcess = spawn(gitBashPath, ["-c", shellCommand], {
    stdio: "inherit",
  });
  const assetsFolder = path.resolve(
    __dirname,
    "..",
    "android",
    "app",
    "src",
    "main",
    "assets"
  );
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder, { recursive: true });
  }
  gitBashProcess.on("error", (error) => {
    console.error(`Error: ${error.message}`);
  });

  gitBashProcess.on("exit", (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  gitBashProcess.on("close", async (code) => {
    if (code === 0) {
      console.log("Assets generated.");
    } else {
      console.error(`Git Bash process exited with code: ${code}`);
    }
  });
}

function openGitBash() {
  const moduleInstallProcess = spawn(
    gitBashPath,
    ["-c", `cd ${gitBashCompatibleRootpath} && npm i`],
    {
      stdio: "inherit",
    }
  );
  moduleInstallProcess.on("error", (error) => {
    console.error(`Error: ${error.message}`);
  });
  moduleInstallProcess.on("close", async (code) => {
    if (code === 0) {
      console.log("Module installed successfully.");
      const shellCommand = `cd ${gitBashCompatiblePath} && yarn install`;

      const gitBashProcess = spawn(gitBashPath, ["-c", shellCommand], {
        stdio: "inherit",
      });

      gitBashProcess.on("error", (error) => {
        console.error(`Error: ${error.message}`);
      });

      gitBashProcess.on("close", async (code) => {
        if (code === 0) {
          console.log(
            "Shell command completed successfully. Now downloading files..."
          );

          try {
            const filesToDownload = [
              {
                url: "https://github.com/Mehul112004/zoom_test/releases/download/zoom/build.gradle",
                destination: path.resolve(
                  __dirname,
                  "..",
                  "android",
                  "mobilertc",
                  "build.gradle"
                ),
              },
              {
                url: "https://github.com/Mehul112004/zoom_test/releases/download/zoom/mobilertc.aar",
                destination: path.resolve(
                  __dirname,
                  "..",
                  "android",
                  "mobilertc",
                  "mobilertc.aar"
                ),
              },
            ];

            for (const file of filesToDownload) {
              console.log(`Downloading ${file.url}...`);
              await downloadFile(file.url, file.destination);
              console.log(`Downloaded ${file.url} to ${file.destination}`);
            }

            console.log("All files downloaded successfully!");
            modifySettingsGradle();
            modifyAppBuildGradle();
            modifyAndroidManifestDebug();
            modifyAndroidManifestMain();
            modifyRootBuildGradle();
            generateAssets();
          } catch (error) {
            console.error(`Error downloading files: ${error.message}`);
          }
        } else {
          console.error(`Git Bash process exited with code: ${code}`);
        }
      });
    } else {
      console.error(`Module install process exited with code: ${code}`);
    }
  });
}

openGitBash();
