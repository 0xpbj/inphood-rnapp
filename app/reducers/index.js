import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import pageReducer from './pageReducer'
import authReducer from './authReducer'
import mediaReducer from './mediaReducer'
import captionReducer from './captionReducer'
import extReducer from './extReducer'
import galReducer from './galReducer'
import galNavReducer from './galNavReducer'
// import groupsReducer from './groupsReducer'
// import groupsNavReducer from './groupsNavReducer'
import chatReducer from './chatReducer'
import visionReducer from './visionReducer'
import selectedReducer from './selectedReducer'
import trainerReducer from './trainerReducer'
import clientDataReducer from './clientDataReducer'
import trainerNavReducer from './trainerNavReducer'
import notificationReducer from './notificationReducer'
import { LOGOUT_SUCCESS }from '../constants/ActionTypes'

const appReducer = combineReducers({
    tabReducer,
    pageReducer,
    authReducer,
    mediaReducer,
    captionReducer,
    clientDataReducer,
    extReducer,
    galReducer,
    galNavReducer,
    // groupsReducer,
    // groupsNavReducer,
    chatReducer,
    selectedReducer,
    trainerReducer,
    trainerNavReducer,
    notificationReducer,
    visionReducer
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) { 
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer
