import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import rootReducer from '../reducers'
import rootSaga from '../sagas/index'
import createSagaMiddleware from 'redux-saga'
import Config from 'react-native-config'
import firebase from 'firebase'
require("firebase/app")
require("firebase/auth")
require("firebase/database")
const fbConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE_URL,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
}
var { AsyncStorage } = require('react-native')

import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge'

// The tracker must be constructed, and you can have multiple:
const tracker = new GoogleAnalyticsTracker('UA-88850545-1')
tracker.trackScreenView('Home')
tracker.trackEvent('Customer', 'New')

// The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
GoogleAnalyticsSettings.setDispatchInterval(30)
GoogleAnalyticsSettings.setDryRun(true)

// import sagaMonitor from './sagaMonitor'
// const sagaMiddleware = createSagaMiddleware({sagaMonitor})
const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  whitelist: [
    'authReducer',
  ],
  blacklist: [
    'galReducer',
    'infoReducer',
    'trainerReducer',
    'captionReducer',
    'chatReducer',
    'clientDataReducer',
    'extReducer',
    'galNavReducer',
    'mediaReducer',
    'notificationReducer',
    'pageReducer',
    'selectedReducer',
    'tabReducer',
    'trainerNavReducer',
    'visionReducer',
  ],
  storage: AsyncStorage,
}

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
    autoRehydrate()
  )
  persistStore(store, persistConfig, () => {})
  .purge(persistConfig.blacklist)
  firebase.initializeApp(fbConfig)
  sagaMiddleware.run(rootSaga)
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
