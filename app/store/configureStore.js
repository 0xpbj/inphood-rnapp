import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import rootReducer from '../reducers'
import rootSaga from '../sagas/index'
import createSagaMiddleware from 'redux-saga'
import config from 'react-native-config'
import firebase from 'firebase'
require("firebase/app")
require("firebase/auth")
require("firebase/database")
const fbConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  databaseURL: config.FIREBASE_DATABASE_URL,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
}
var { AsyncStorage } = require('react-native')

const sagaMiddleware = createSagaMiddleware()

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
    autoRehydrate()
  )
  persistStore(store, {storage: AsyncStorage}, () => {
    console.log('rehydration complete')
  }).purge(['tabReducer', 'trainerReducer'])
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