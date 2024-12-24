/**
 * @format
 */

import {
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
// const my_store = store();
import ErrorBoundary from "react-native-error-boundary";
import crashlytics from "@react-native-firebase/crashlytics";
import Fallback from "./commonComponents/Fallback";

const RNRedux = () => {
  return (
    <ErrorBoundary
      onError={(error) =>
        crashlytics().log("Error : ", error.message, error.stack)
      }
      FallbackComponent={Fallback}
    >
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
