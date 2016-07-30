import { LOAD_CAMERAMEDIA_SUCCESS } from '../constants/ActionTypes'

const initialState = {
  cameraMedia: []
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERAMEDIA_SUCCESS:
      return {
        ...state,
        cameraMedia: action.cameraMedia
      }
    default:
      return state
  }
}
