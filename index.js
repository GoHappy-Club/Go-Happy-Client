/**
 * @format
 */

import { AppRegistry, StatusBar, Text, useWindowDimensions, View } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { rectangleSvgPath } from "./commonComponents/svgPath";
import React from "react";
import store from "./store/store";
import { CopilotProvider, useCopilot } from "react-native-copilot";
import CustomTooltip from "./commonComponents/tooltip";
import StepNumber from "./commonComponents/StepNumber";
import { Colors } from "./assets/colors/color";
import firebase from "@react-native-firebase/app";
// const my_store = store();

const RNRedux = () => {
  const { height } = useWindowDimensions();
  return (
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
        <App />
      </Provider>
    </CopilotProvider>
  );
};

firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    console.log("App has been launched in the background by iOS, ignore");
    
    return null;
  }

  return <RNRedux />;
}

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => HeadlessCheck);
// AppRegistry.registerComponent('app', () => HeadlessCheck);
