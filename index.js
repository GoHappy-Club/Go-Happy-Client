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
import SpInAppUpdates, {
  IAUUpdateKind,
  IAUInstallStatus,
} from "sp-react-native-in-app-updates";
// const my_store = store();

const RNRedux = () => {
  const { height } = useWindowDimensions();
  const checkForUpdate = async () => {
    const inAppUpdates = new SpInAppUpdates(
      false // isDebug
    );
    try {
      await inAppUpdates.checkNeedsUpdate().then((result) => {
        try {
          if (result.shouldUpdate) {
            let updateOptions = {};
            if (Platform.OS === "android") {
              updateOptions = {
                updateType: IAUUpdateKind.IMMEDIATE,
              };
            }
            if (Platform.OS === "ios") {
              updateOptions = {
                title: "Update available",
                message:
                  "There is a new version of the app available on the App Store, do you want to update it?",
                buttonUpgradeText: "Update",
                buttonCancelText: "Cancel",
              };
            }
            inAppUpdates.addStatusUpdateListener((downloadStatus) => {
              console.log("download status", downloadStatus);
              if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
                console.log("downloaded");
                inAppUpdates.installUpdate();
                inAppUpdates.removeStatusUpdateListener((finalStatus) => {
                  console.log("final status", finalStatus);
                });
              }
            });
            inAppUpdates.startUpdate(updateOptions);
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);
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
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => RNRedux);
