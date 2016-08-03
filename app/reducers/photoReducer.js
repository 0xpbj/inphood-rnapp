import { LOAD_CAMERAMEDIA_SUCCESS, APPEND_CAMERAMEDIA_SUCCESS } from '../constants/ActionTypes'

const initialState = {
  cameraMedia: [],
  appendMedia: []
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERAMEDIA_SUCCESS:
      return {
        ...state,
        cameraMedia: action.cameraMedia
      }
    case APPEND_CAMERAMEDIA_SUCCESS:
      let array = state.cameraMedia
      array.push.apply(array, action.appendMedia)
      return {
        ...state,
        cameraMedia: array
      }
    default:
      return state
  }
}
