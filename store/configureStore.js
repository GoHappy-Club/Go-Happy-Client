import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import countReducer from '../redux/reducers/countReducer';
import profileReducer from '../redux/reducers/profileReducer';
import thunk from 'redux-thunk'

const rootReducer = combineReducers(
    { count: countReducer,profile: profileReducer}
);
const configureStore = () => {
    return createStore(rootReducer, compose(
        applyMiddleware(thunk),
        // other store enhancers if any
      ));
}
export default configureStore;