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
  if (action.type === 'LOGOUT_SUCCESS') {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer