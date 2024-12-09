import Reactotron, {
  networking,
  openInEditor,
  trackGlobalErrors,
  asyncStorage,
} from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reactotronRedux } from "reactotron-redux";

let reactotron;

if (__DEV__) {
  reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
    .configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .use(networking())
    .use(openInEditor())
    .use(trackGlobalErrors())
    .use(asyncStorage())
    .use(reactotronRedux())
    .connect(); // let's connect!

  console.tron = reactotron; // For convenience, to log to Reactotron using `console.tron.log`
} else {
  reactotron = undefined; // Return undefined in production
}

export default reactotron;
