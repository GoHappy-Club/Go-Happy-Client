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
import StepNumber from "./commonComponents/StepNumber";
import { Colors } from "./assets/colors/color";
import { ZoomSDKProvider } from "zoom-msdk-rn";
import { ZOOM_JWT_TOKEN } from "./config/tokens";
import { generateZoomSignature } from "./services/zoom/zoomTokenGenerator";
// const my_store = store();

const RNRedux = () => {
  const { height } = useWindowDimensions();
  return (
    <CopilotProvider
      verticalOffset={20}
      arrowColor={Colors.copilotArrow}
      animated={true}
      tooltipComponent={CustomTooltip}
      overlay="svg"
      svgMaskPath={rectangleSvgPath}
      stepNumberComponent={StepNumber}
    >
      <Provider store={store()}>
        <ZoomSDKProvider
          config={{
            jwtToken: String(generateZoomSignature()),
            domain: "zoom.us",
            enableLog: true,
            logSize: 5,
          }}
        >
          <App />
        </ZoomSDKProvider>
      </Provider>
    </CopilotProvider>
  );
};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => RNRedux);
