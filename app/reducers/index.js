import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import authReducer from './authReducer'
import camReducer from './camReducer'
import photoReducer from './photoReducer'
import libReducer from './libReducer'
import galReducer from './galReducer'
import galNavReducer from './galNavReducer'
import chatReducer from './chatReducer'
import trainerReducer from './trainerReducer'
import trainerNavReducer from './trainerNavReducer'

import Config from 'react-native-config'
import Firedux from 'firedux'
import firebase from 'firebase'
require("firebase/app");
require("firebase/auth");
require("firebase/database");

const config = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE_URL,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
}
firebase.initializeApp(config)
var ref = firebase.database().ref()

const firedux = new Firedux({
  ref,
  omit: ['$localState']
})

const rootReducer = combineReducers({
    tabReducer,
    authReducer,
    camReducer,
    photoReducer,
    libReducer,
    galReducer,
    galNavReducer,
    chatReducer,
    trainerReducer,
    trainerNavReducer,
    firedux: firedux.reducer()
})

export default rootReducer
