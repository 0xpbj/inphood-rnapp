import {
  STORE_DEVICE_ID, STORE_UID, APP_UPDATED,
  STORE_APP_VERSION, CONNECTION_INACTIVE
} from '../constants/ActionTypes'

const initialState = {
  uid: '',
  deviceId: '',
  appVersion: '',
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case APP_UPDATED:
      return {
        ...state,
        uid: ''
      }
    case STORE_DEVICE_ID:
      return {
        ...state,
        deviceId: action.deviceId
      }
    case STORE_UID:
      return {
        ...state,
        uid: action.uid
      }
    case STORE_APP_VERSION:
      return {
        ...state,
        appVersion: action.appVersion
      }
    case CONNECTION_INACTIVE:
      return {
        ...state,
        uid: ''
      }
    default:
      return state
  }
}