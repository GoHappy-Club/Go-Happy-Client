/**
 * @format
 */

import { AppRegistry, Text } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { rectangleSvgPath } from "./commonComponents/svgPath";
import React from "react";
import store from "./store/store";
import { CopilotProvider } from "react-native-copilot";
import CustomTooltip from "./commonComponents/tooltip";
// const my_store = store();
const circleSvgPath = ({ position, canvasSize }) =>
  `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${position.y._value}Za50 50 0 1 0 100 0 50 50 0 1 0-100 0`;

const RNRedux = () => {
  return (
    <CopilotProvider
      verticalOffset={20}
      arrowColor="#9FA8DA"
      // tooltipStyle={{ borderRadius: 0 }}
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
