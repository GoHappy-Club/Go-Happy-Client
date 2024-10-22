import { applyMiddleware, combineReducers, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import countReducer from '../redux/reducers/countReducer';
import profileReducer from '../redux/reducers/profileReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import membershipReducer from '../redux/reducers/membershipReducer';

const rootReducer = combineReducers({
  count: countReducer,
  profile: profileReducer,
  membership : membershipReducer
});
const store = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: () => []
  }
  )
};
export default store;
