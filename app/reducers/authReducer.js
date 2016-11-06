import {
  LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_SUCCESS, LOGOUT_ERROR,
  USER_SETTINGS, LOGIN_IN_PROGRESS,
  STORE_DEVICE_ID, STORE_UID,
  BRANCH_REFERRAL_INFO, BRANCH_AUTH_TRAINER,
  STORE_PROFILE_PICTURE, STORE_CDN_PICTURE,
  STORE_TRAINER_ID
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

const initialState = {
  uid: '',
  deviceId: '',
  error: null,
  inProgress: false,
  settings: {},
  referralSetup: false,
  referralType: '',
  referralId: '',
  authTrainer: 'pending',
  trainerName: '',
  trainerId: '',
  localProfilePicture: '',
  cdnProfilePicture: '',
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case LOGIN_IN_PROGRESS:
      return {
        ...state,
        inProgress: action.flag
      }
    case LOGOUT_SUCCESS:
      return {
        ...initialState
      }
    case LOGIN_ERROR:
      return {
        ...initialState,
        value: null,
        error: action.error
      }
    case LOGOUT_ERROR:
      return {
        ...state,
        error: action.error,
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
    case USER_SETTINGS:
      return {
        ...state,
        settings: action.settings
      }
    case STORE_TRAINER_ID:
      return {
        ...state,
        trainerId: action.trainerId
      }
    case BRANCH_REFERRAL_INFO:
      return {
        ...state,
        referralSetup: action.referralSetup,
        referralType: action.referralType,
        referralId: action.referralId,
        trainerName: action.trainerName
      }
    case BRANCH_AUTH_TRAINER:
      return {
        ...state,
        authTrainer: action.response
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: ''
      }
    case STORE_PROFILE_PICTURE:
      return {
        ...state,
        cdnProfilePicture: '',
        localProfilePicture: action.image
      }
    case STORE_CDN_PICTURE:
      return {
        ...state,
        cdnProfilePicture: action.picture,
        localProfilePicture: ''
      }
    default:
      return state
  }
}
