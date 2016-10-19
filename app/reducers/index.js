import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import authReducer from './authReducer'
import camReducer from './camReducer'
import libReducer from './libReducer'
import extReducer from './extReducer'
import galReducer from './galReducer'
import galNavReducer from './galNavReducer'
import chatReducer from './chatReducer'
import trainerReducer from './trainerReducer'
import trainerDataReducer from './trainerDataReducer'
import trainerNavReducer from './trainerNavReducer'
import notificationReducer from './notificationReducer'
import { LOGOUT_SUCCESS }from '../constants/ActionTypes'

const appReducer = combineReducers({
    tabReducer,
    authReducer,
    camReducer,
    libReducer,
    extReducer,
    galReducer,
    galNavReducer,
    chatReducer,
    trainerReducer,
    trainerDataReducer,
    trainerNavReducer,
    notificationReducer,
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) { 
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer
