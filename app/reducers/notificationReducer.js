import { 
  INCREMENT_CLIENT_NOTIFICATION,
  DECREMENT_CLIENT_NOTIFICATION,
  INCREMENT_TRAINER_NOTIFICATION,
  DECREMENT_TRAINER_NOTIFICATION,
  INCREMENT_CLIENT_CHAT_NOTIFICATION,
  DECREMENT_CLIENT_CHAT_NOTIFICATION,
  INCREMENT_TRAINER_CHAT_NOTIFICATION,
  DECREMENT_TRAINER_CHAT_NOTIFICATION,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION,
  DECREMENT_TRAINER_PHOTO_NOTIFICATION,
  ADD_CLIENT_NOTIFICATION,
  ADD_TRAINER_NOTIFICATION,
  CLEAR_CLIENT_ALERT,
  CLEAR_TRAINER_ALERT
} from '../constants/ActionTypes'

const initialState = {
  client: 0,
  trainer: 0,
  clientUID: [],
  trainerUID: [],
  clientPhotos: [],
  trainerPhotos: [],
  trainerPhotosFlag: [],
  photoMessages: [],
  clientNotification: '',
  trainerNotification: ''
}

export default function notification (state = initialState, action) {
  let uid = []
  let data = []
  switch (action.type) {
    case INCREMENT_CLIENT_NOTIFICATION:
      uid = state.trainerUID
      if(!uid[action.uid]) {
        uid[action.uid] = 0
      }
      uid[action.uid] = uid[action.uid] + 1
      return {
        ...state,
        client: state.client + 1,
        trainerUID: uid
      }
    case DECREMENT_CLIENT_NOTIFICATION:
      uid = state.trainerUID
      uid[action.uid] = 0
      if (state.client > 0) {
        return {
          ...state,
          client: state.client - 1,
          trainerUID: uid
        }
      }
      else {
        return state
      }
    case INCREMENT_TRAINER_NOTIFICATION:
      uid = state.clientUID
      if(!uid[action.uid]) {
        uid[action.uid] = 0
      }
      uid[action.uid] = uid[action.uid] + 1
      return {
        ...state,
        trainer: state.trainer + 1,
        clientUID: uid
      }
    case DECREMENT_TRAINER_NOTIFICATION:
      uid = state.clientUID
      uid[action.uid] = 0
      if (state.trainer > 0) {
        return {
          ...state,
          trainer: state.trainer - 1,
          clientUID: uid
        }
      }
      else {
        return state
      }
    case INCREMENT_CLIENT_CHAT_NOTIFICATION:
      data = state.clientPhotos
      if (!data[action.photo]) {
        data[action.photo] = 0
      }
      data[action.photo] = data[action.photo] + 1
      return {
        ...state,
        clientPhotos: data,
        clientNotification: 'Your trainer has sent a new message'
      }
    case DECREMENT_CLIENT_CHAT_NOTIFICATION:
      data = state.clientPhotos
      data[action.photo] = 0
      return {
        ...state,
        clientPhotos: data
      }
    case INCREMENT_TRAINER_CHAT_NOTIFICATION:
      data = state.trainerPhotos
      if (!data[action.photo]) {
        data[action.photo] = 0
      }
      data[action.photo] = data[action.photo] + 1
      return {
        ...state,
        trainerPhotos: data,
        trainerNotification: 'Your client has sent a new message'
      }
    case DECREMENT_TRAINER_CHAT_NOTIFICATION:
      data = state.trainerPhotos
      data[action.photo] = 0
      return {
        ...state,
        trainerPhotos: data
      }
    case INCREMENT_TRAINER_PHOTO_NOTIFICATION:
      data = state.trainerPhotosFlag
      if (!data[action.photo]) {
        data[action.photo] = true
      }
      return {
        ...state,
        trainerPhotosFlag: data,
        trainerNotification: 'Your client has added a new photo'
      }
    case DECREMENT_TRAINER_PHOTO_NOTIFICATION:
      data = state.trainerPhotosFlag
      data[action.photo] = false
      return {
        ...state,
        trainerPhotosFlag: data
      }
    case ADD_CLIENT_NOTIFICATION:
      return {
        ...state,
        // client: action.count,
        clientNotification: action.notification
      }
    case ADD_TRAINER_NOTIFICATION:
      return {
        ...state,
        // trainer: action.count,
        trainerNotification: action.notification
      }
    case CLEAR_CLIENT_ALERT:
      return {
        ...state,
        clientNotification: ''
      }
    case CLEAR_TRAINER_ALERT:
      return {
        ...state,
        trainerNotification: ''
      }
    default:
      return state
  }
}
