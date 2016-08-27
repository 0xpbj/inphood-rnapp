import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import authReducer from './authReducer'
import camReducer from './camReducer'
import photoReducer from './photoReducer'
import libReducer from './libReducer'
import galReducer from './galReducer'
import galNavReducer from './galNavReducer'
import clientChatReducer from './clientChatReducer'
import trainerChatReducer from './trainerChatReducer'
import trainerReducer from './trainerReducer'
import trainerNavReducer from './trainerNavReducer'

const rootReducer = combineReducers({
    tabReducer,
    authReducer,
    camReducer,
    photoReducer,
    libReducer,
    galReducer,
    galNavReducer,
    clientChatReducer,
    trainerChatReducer,
    trainerReducer,
    trainerNavReducer,
})

export default rootReducer
