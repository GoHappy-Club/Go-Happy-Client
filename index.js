/**
 * @format
 */

import { AppRegistry, Text, useWindowDimensions, View } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { rectangleSvgPath } from "./commonComponents/svgPath";
import React from "react";
import store from "./store/store";
import { CopilotProvider, useCopilot } from "react-native-copilot";
import CustomTooltip from "./commonComponents/tooltip";
// const my_store = store();

const RNRedux = () => {
  const { height } = useWindowDimensions();
  return (
    <CopilotProvider
      verticalOffset={20}
      arrowColor="#9FA8DA"
      animated={true}
      tooltipComponent={CustomTooltip}
      overlay="svg"
      svgMaskPath={rectangleSvgPath}
    >
      <Provider store={store()}>
        <App />
      </Provider>
    </CopilotProvider>
  );
};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => RNRedux);
