import { combineReducers } from 'redux';
import LoginReducer from './isLogin';
import CredentialsReducer from './currentUserCredentials';
/**
* Creates the global state by combining all the reducer content into 1 global state object
*/
const rootReducer = combineReducers({
  currentUserCredentials: CredentialsReducer,
  isLoggedIn: LoginReducer
});

export default rootReducer;
