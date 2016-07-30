import { SEND_AWS_SUCCESS, LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_FAILURE, APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_FAILURE } from '../constants/ActionTypes'

const defaultState = {
  photos: [],
  count: 0,
  error: ''
}

export default function images(state = defaultState, action) {
  switch(action.type) {
    case LOAD_PHOTOS_SUCCESS:
      return {...state, photos: action.photos}
    case APPEND_PHOTOS_SUCCESS:
      return {...state, count: state.count + 1}
    case LOAD_PHOTOS_FAILURE:
    case APPEND_PHOTOS_FAILURE:
      return {...state, error: action.error}
    default:
      return state
  }
}
