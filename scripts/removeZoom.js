const fs = require('fs').promises;
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

async function revertSettingsGradle() {
  const filePath = path.join(rootDir, 'android', 'settings.gradle');
  let content = await fs.readFile(filePath, 'utf8');
  content = content.replace(/include ':mobilertc'\s+/, '');
  await fs.writeFile(filePath, content, 'utf8');
  console.log('Reverted settings.gradle');
}

async function revertAppBuildGradle() {
  const filePath = path.join(rootDir, 'android', 'app', 'build.gradle');
  let content = await fs.readFile(filePath, 'utf8');
  content = content.replace(/implementation group: 'com\.google\.android\.flexbox', name: 'flexbox', version: '3\.0\.0'\s+/, '');
  content = content.replace(/implementation project\(':mobilertc'\)\s+/, '');
  content = content.replace(/compileOptions {\s+sourceCompatibility JavaVersion\.VERSION_17\s+targetCompatibility JavaVersion\.VERSION_17\s+}\s+kotlinOptions {\s+jvmTarget = '17'\s+}/, '');
  await fs.writeFile(filePath, content, 'utf8');
  console.log('Reverted app/build.gradle');
}

async function revertRootBuildGradle() {
  const filePath = path.join(rootDir, 'android', 'build.gradle');
  let content = await fs.readFile(filePath, 'utf8');
  content = content.replace(/minSdkVersion = 23/, 'minSdkVersion = 21');
  await fs.writeFile(filePath, content, 'utf8');
  console.log('Reverted root build.gradle');
}

async function revertAndroidManifestDebug() {
  const filePath = path.join(rootDir, 'android', 'app', 'src', 'debug', 'AndroidManifest.xml');
  let content = await fs.readFile(filePath, 'utf8');
  content = content.replace(/\s+tools:replace="android:usesCleartextTraffic"/, '');
  await fs.writeFile(filePath, content, 'utf8');
  console.log('Reverted debug AndroidManifest.xml');
}

async function revertAndroidManifestMain() {
  const filePath = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  const originalContent = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.gohappyclient">

    <uses-permission android:name="android.permission.INTERNET" />
    <!-- <uses-permission android:name="android.permission.READ_CONTACTS" /> -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="com.android.alarm.permission.SET_ALARM" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.BROADCAST_CLOSE_SYSTEM_DIALOGS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <!-- <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" /> -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

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
  await fs.writeFile(filePath, originalContent, 'utf8');
  console.log('Reverted main AndroidManifest.xml');
}

async function removeDownloadedFiles() {
  const mobilertcDir = path.join(rootDir, 'android', 'mobilertc');
  try {
    await fs.rm(mobilertcDir, { recursive: true, force: true });
    console.log('Removed mobilertc directory');
  } catch (error) {
    console.error('Error removing mobilertc directory:', error);
  }
}

async function removeZoomSDK() {
  const zoomSDKDirectory = path.join(rootDir, 'node_modules', 'zoom-msdk-rn');
  try {
    await fs.rm(zoomSDKDirectory, { recursive: true, force: true });
    console.log('Removed zoom SDK directory');
  } catch (error) {
    console.error('Error removing Zoom SDK directory:', error);
  }
}

async function removeGeneratedAssets() {
  const assetsDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets');
  try {
    const files = await fs.readdir(assetsDir);
    for (const file of files) {
      await fs.unlink(path.join(assetsDir, file));
    }
    console.log('Removed generated assets');
  } catch (error) {
    console.error('Error removing generated assets:', error);
  }
}

async function revertZoomSDKChanges() {
  try {
    await revertSettingsGradle();
    await revertAppBuildGradle();
    await revertRootBuildGradle();
    await revertAndroidManifestDebug();
    await revertAndroidManifestMain();
    await removeDownloadedFiles();
    await removeGeneratedAssets();
    await removeZoomSDK();
    console.log('All changes have been reverted successfully.');
  } catch (error) {
    console.error('Error reverting changes:', error);
  }
}

revertZoomSDKChanges();