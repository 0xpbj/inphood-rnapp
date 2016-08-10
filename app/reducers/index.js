import { combineReducers } from 'redux'
import tabReducer from './tabReducer'
import authReducer from './authReducer'
import navReducer from './navReducer'
import camReducer from './camReducer'
import photoReducer from './photoReducer'
import libReducer from './libReducer'
import galReducer from './galReducer'
import galNavReducer from './galNavReducer'
import chatReducer from './chatReducer'

const rootReducer = combineReducers({
  tabReducer,
  authReducer,
  navReducer,
  camReducer,
  photoReducer,
  libReducer,
  galReducer,
  galNavReducer,
  chatReducer,
})

export default rootReducer
