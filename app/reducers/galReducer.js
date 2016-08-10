import { IS_NEW_USER, SEND_AWS_SUCCESS, FEEDBACK_PHOTO, LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_FAILURE, APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_FAILURE } from '../constants/ActionTypes'

const defaultState = {
  photos: [],
  count: 0,
  error: '',
  newUser: false,
}

export default function gallery(state = defaultState, action) {
  switch(action.type) {
    case LOAD_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: action.photos
      }
    case SEND_AWS_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
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
