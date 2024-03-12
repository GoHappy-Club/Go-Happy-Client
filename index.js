/**
 * @format
 */

import { AppRegistry, Text } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";

import React from "react";

import store from "./store/store";

// const my_store = store();

const RNRedux = () => {
  return (
  <Provider store={store()}>
    <App />
  </Provider>
)};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => RNRedux);
 