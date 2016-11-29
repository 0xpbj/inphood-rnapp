import {
  LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_SUCCESS, LOGOUT_ERROR,
  USER_SETTINGS, LOGIN_IN_PROGRESS,
  BRANCH_REFERRAL_INFO, BRANCH_AUTH_SETUP,
  STORE_PROFILE_PICTURE, STORE_CDN_PICTURE,
  STORE_REFERRAL_ID, STORE_USER_NAME, CONNECTION_INACTIVE,
} from '../constants/ActionTypes'

const initialState = {
  error: null,
  inProgress: false,
  settings: {},
  referralSetup: false,
  referralType: '',
  referralSetup: 'pending',
  referralName: '',
  referralDeviceId: '',
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
    case CONNECTION_INACTIVE:
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
    case USER_SETTINGS:
      return {
        ...state,
        settings: action.settings
      }
    case BRANCH_REFERRAL_INFO:
      return {
        ...state,
        referralSetup: action.referralSetup,
        referralType: action.referralType,
        referralName: action.referralName,
        referralDeviceId: action.referralDeviceId
      }
    case BRANCH_AUTH_SETUP:
      return {
        ...state,
        referralSetup: action.response
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: ''
      }
    case STORE_USER_NAME:
      const values = action.name ? action.name.split(" ") : null
      const first_name = action.name ? values[0] : ''
      const last_name = action.name ? values[1] : ''
      const settings = state.settings
      const userSettings = {first_name, last_name, birthday: settings.birthday, height: settings.height, diet: settings.diet, email: settings.email}
      return {
        ...state,
        settings: userSettings
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
