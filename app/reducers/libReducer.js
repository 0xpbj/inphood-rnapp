import { LOAD_CAMERAMEDIA_SUCCESS, SELECT_PHOTO, STORE_LIBRARY_CAPTION } from '../constants/ActionTypes'

const initialState = {
  selected: '',
  caption: '',
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case SELECT_PHOTO:
      return {
        ...state,
        selected: action.selected
      }
    case STORE_LIBRARY_CAPTION:
      return {
        ...state,
        caption: action.caption
      }
    default:
      return state
  }
}
