import { IS_NEW_USER, FILTER_PHOTOS, SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS, FEEDBACK_PHOTO, LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_FAILURE, APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_FAILURE } from '../constants/ActionTypes'

const defaultState = {
  photos: [],
  count: 0,
  error: '',
  filter: '',
  newUser: false,
}

export default function gallery(state = defaultState, action) {
  switch(action.type) {
    case LOAD_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: action.photos
      }
    case SEND_FIREBASE_LIBRARY_SUCCESS:
    case SEND_FIREBASE_CAMERA_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
      }
    case FILTER_PHOTOS:
      return {
        ...state,
        filter: action.filter
      }
    case IS_NEW_USER:
      return {
        ...state,
        newUser: action.flag
      }
    case APPEND_PHOTOS_SUCCESS:
      let array = action.appendPhotos
      array.push.apply(array, state.photos)
      return {
        ...state,
        photos: array
      }
    case LOAD_PHOTOS_FAILURE:
    case APPEND_PHOTOS_FAILURE:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}
