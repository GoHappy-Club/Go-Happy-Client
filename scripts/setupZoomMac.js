const { spawn } = require("child_process");
const path = require("path");
const axios = require("axios");
const fs = require("fs");

const zoomSDKDirectory = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "zoom-msdk-rn"
);

const rootDir = path.resolve(__dirname, "..");

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

    const data1 = data.replace("// jcenter()", `jcenter()`);
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
    <!-- ... (rest of the permissions) ... -->

    <application
        android:requestLegacyExternalStorage="true"
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        <!-- ... (rest of the application content) ... -->
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

  const process = spawn("sh", ["-c", shellCommand], {
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
  process.on("error", (error) => {
    console.error(`Error: ${error.message}`);
  });

  process.on("exit", (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  process.on("close", async (code) => {
    if (code === 0) {
      console.log("Assets generated.");
    } else {
      console.error(`Process exited with code: ${code}`);
    }
  });
}

function runCommands() {
  const moduleInstallProcess = spawn(
    "sh",
    ["-c", `cd "${rootDir}" && npm i`],
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
      const shellCommand = `cd "${zoomSDKDirectory}" && yarn install`;

      const process = spawn("sh", ["-c", shellCommand], {
        stdio: "inherit",
      });

      process.on("error", (error) => {
        console.error(`Error: ${error.message}`);
      });

      process.on("close", async (code) => {
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
          console.error(`Process exited with code: ${code}`);
        }
      });
    } else {
      console.error(`Module install process exited with code: ${code}`);
    }
  });
}

runCommands();