import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import authReducer from './authReducer'
import camReducer from './camReducer'
import camNavReducer from './camNavReducer'
import photoReducer from './photoReducer'
import libReducer from './libReducer'
import libNavReducer from './libNavReducer'
import galReducer from './galReducer'

const rootReducer = combineReducers({
  tabReducer,
  authReducer,
  camReducer,
  camNavReducer,
  photoReducer,
  libReducer,
  libNavReducer,
  galReducer,
})

export default rootReducer
