import {
  STORE_DEVICE_ID, STORE_UID, CONNECTION_INACTIVE
} from '../constants/ActionTypes'

const initialState = {
  uid: '',
  deviceId: '',
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
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
    case CONNECTION_INACTIVE:
      return {
        ...state,
        uid: ''
      }
    default:
      return state
  }
}
