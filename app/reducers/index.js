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
import notificationReducer from './notificationReducer'

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
    notificationReducer,
})

export default rootReducer
