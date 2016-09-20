import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import authReducer from './authReducer'
import camReducer from './camReducer'
import photoReducer from './photoReducer'
import libReducer from './libReducer'
import extReducer from './extReducer'
import galReducer from './galReducer'
import galNavReducer from './galNavReducer'
import chatReducer from './chatReducer'
import trainerReducer from './trainerReducer'
import trainerNavReducer from './trainerNavReducer'
import notificationReducer from './notificationReducer'
import { LOGOUT_SUCCESS }from '../constants/ActionTypes'

const appReducer = combineReducers({
    tabReducer,
    authReducer,
    camReducer,
    photoReducer,
    libReducer,
    extReducer,
    galReducer,
    galNavReducer,
    chatReducer,
    trainerReducer,
    trainerNavReducer,
    notificationReducer,
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    console.log('state cleared')
    console.log(state)
    state = undefined
    console.log(state)
  }
  return appReducer(state, action)
}

export default rootReducer