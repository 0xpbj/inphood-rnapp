import {
  LOGIN_SUCCESS, LOGIN_ERROR, INIT_LOGIN,
  LOGOUT_SUCCESS, LOGOUT_ERROR, USER_SETTINGS,
  STORE_TOKEN, STORE_RESULT, STORE_VALUE, IS_NEW_USER,
  EM_LOGIN_REQUEST, BRANCH_REFERRAL_INFO, BRANCH_AUTH_TRAINER
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

const initialState = {
  token: '',
  result: null,
  error: null,
  inProgress: false,
  value: null,
  settings: {},
  referralSetup: false,
  referralType: '',
  referralId: '',
  authTrainer: 'pending',
  trainerName: '',
  userSet: false
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    // case REHYDRATE:
    //   console.log(action.payload.authReducer)
    //   return {
    //     state: action.payload.authReducer
    //   }
    case INIT_LOGIN:
      return {
        ...state,
        inProgress: action.flag
      }
    case IS_NEW_USER:
      return {
        ...state,
        userSet: true
      }
    case LOGOUT_SUCCESS:
      return initialState
    case LOGIN_ERROR:
    case LOGOUT_ERROR:
      return {
        ...state,
        error: action.error,
        inProgress: action.flag
      }
    case STORE_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case STORE_RESULT:
      return {
        ...state,
        result: action.result
      }
    case STORE_VALUE:
      return {
        ...state,
        value: action.value
      }
    case USER_SETTINGS:
      return {
        ...state,
        settings: action.settings
      }
    case EM_LOGIN_REQUEST:
      return {
        ...state,
        value: action.value
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
    default:
      return state
  }
}