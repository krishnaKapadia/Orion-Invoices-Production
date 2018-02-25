import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './Redux/Reducers/reducers';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss';
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';
// Animation.css library
import './Style/animation.css';

// Containers
import Full from './containers/Full/'
import Authenticate from './components/Authentication/Authenticate';
import Login from './views/Login';

import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import reduxReset from 'redux-reset';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const createReduxStore = compose(applyMiddleware(), reduxReset(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())(createStore);
const history = createBrowserHistory();

// Persisting redux state on refresh
const persistedReducer = persistReducer({ key: 'root', storage, stateReconciler: autoMergeLevel2 }, rootReducer);
var store = createReduxStore(persistedReducer, compose( reduxReset(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))
var persistor = persistStore(store)

ReactDOM.render((
  // <Provider store={createReduxStore(rootReducer)}>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <Switch>
          {/* Requires user login to access app */}
          <Route history={history} path="/" name="Home" component={Full} />

          {/* <Redirect from="/" to="/login"/> */}
        </Switch>
      </HashRouter>
    </PersistGate>
  </Provider>
), document.getElementById('root'));
