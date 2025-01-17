/**
 * @format
 */

import {
  Alert,
  AppRegistry,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { rectangleSvgPath } from "./commonComponents/svgPath";
import React, { useEffect } from "react";
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
import {startUpdateFlow, UpdateFlow} from '@gurukumparan/react-native-android-inapp-updates';

const errorHandler = (error, stackTrace) => {
  crashlytics().log(
    "Error(Caught with error boundary) : " + error + stackTrace
  );
};

const RNRedux = () => {
  async function checkForUpdate() {
    try {
      const result = await startUpdateFlow(UpdateFlow.FLEXIBLE);
      Alert.alert("result checkupdate", result);
      console.log("result in checkForUpdate:", result);
    } catch (e) {
      console.log("error in checkforupdate:", e?.message);
    }
  }
  useEffect(() => {
    checkForUpdate();
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
        </Provider>
      </CopilotProvider>
    </ErrorBoundary>
  );
};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => RNRedux);
// AppRegistry.registerComponent('app', () => HeadlessCheck);
