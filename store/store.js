import { applyMiddleware, combineReducers, compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import countReducer from "../redux/reducers/countReducer";
import profileReducer from "../redux/reducers/profileReducer";
import membershipReducer from "../redux/reducers/membershipReducer";
import reactotron from "../RectotronConfig";

const rootReducer = combineReducers({
  count: countReducer,
  profile: profileReducer,
  membership: membershipReducer,
});
const store = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: () => [],
    enhancers: (getDefaultEnhancers) => {
      const reactotronEnhancer = __DEV__ ? [reactotron.createEnhancer()] : [];
      return getDefaultEnhancers().concat(reactotronEnhancer);
    },
  });
};
export default store;
