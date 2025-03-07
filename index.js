/**
 * @format
 */

import {
  Alert,
  AppRegistry,
  Linking,
  Platform,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { rectangleSvgPath } from "./commonComponents/svgPath";
import React, { useEffect, useState } from "react";
import store from "./store/store";
import { CopilotProvider, useCopilot } from "react-native-copilot";
import CustomTooltip from "./commonComponents/tooltip";
import StepNumber from "./commonComponents/StepNumber";
import { Colors } from "./assets/colors/color";
import firebase from "@react-native-firebase/app";
// import { ZoomSDKProvider } from "@zoom/meetingsdk-react-native";
import { generateZoomSignature } from "./helpers/generateZoomSignature";
import ErrorBoundary from "react-native-error-boundary";
import crashlytics from "@react-native-firebase/crashlytics";
import Fallback from "./commonComponents/Fallback";
import {
  startUpdateFlow,
  UpdateFlow,
} from "@gurukumparan/react-native-android-inapp-updates";
import AwesomeAlert from "react-native-awesome-alerts";
import DeviceInfo from "react-native-device-info";
import compareVersions from "semver-compare";

const errorHandler = (error, stackTrace) => {
  crashlytics().log(
    "Error(Caught with error boundary) : " + error + stackTrace
  );
};

const RNRedux = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [updateUrl, setUpdateUrl] = useState(
    Platform.OS === "ios"
      ? "https://apps.apple.com/in/app/gohappyclient/idcom.gohappyclient"
      : "https://play.google.com/store/apps/details?id=com.gohappyclient"
  );

  async function checkForUpdateAndroid() {
    try {
      startUpdateFlow(UpdateFlow.IMMEDIATE).then((result) => {
        if (result == "Canceled") {
          setShowAlert(true);
        }
      });
    } catch (e) {
      crashlytics().log("Error in checkforupdate: " + e?.message);
    }
  }

  async function checkForUpdateIos() {
    const latestVersion = await fetch(
      `https://itunes.apple.com/lookup?bundleId=com.gohappyclient`
    )
      .then((r) => r.json())
      .then((res) => {
        return res?.results[0]?.version;
      });
    const currentVersion = DeviceInfo.getVersion();
    if (compareVersions(latestVersion, currentVersion) > 0) {
      setShowAlert(true);
    }
  }
  useEffect(() => {
    Platform.OS === "ios" ? checkForUpdateIos() : checkForUpdateAndroid();
  }, []);
  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={Fallback}>
      <CopilotProvider
        verticalOffset={StatusBar.currentHeight}
        arrowColor={Colors.copilotArrow}
        animated={true}
        tooltipComponent={CustomTooltip}
        overlay="svg"
        svgMaskPath={rectangleSvgPath}
        stepNumberComponent={StepNumber}
      >
        <Provider store={store()}>
          {/* <ZoomSDKProvider
          config={{
            jwtToken: String(generateZoomSignature()),
            domain: "zoom.us",
            enableLog: true,
            logSize: 5,
          }}
        > */}
          <App />
          {/* </ZoomSDKProvider> */}
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Update Required"
            message="Please update the app to continue using it."
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="Update"
            confirmButtonColor={Colors.primary}
            onConfirmPressed={() => {
              Linking.openURL(updateUrl);
              setShowAlert(false);
            }}
          />
        </Provider>
      </CopilotProvider>
    </ErrorBoundary>
  );
};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => RNRedux);
// AppRegistry.registerComponent('app', () => HeadlessCheck);
