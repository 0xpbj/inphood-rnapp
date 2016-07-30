import { TAKE_PHOTO, STORE_CAMERA_CAPTION } from '../constants/ActionTypes'

const initialState = {
  photo: '',
  caption: '',
}

export default function photos (state = initialState, action) {
  switch (action.type) {
    case TAKE_PHOTO:
      return {
        ...state,
        photo: action.photo
      }
    case STORE_CAMERA_CAPTION:
      return {
        ...state,
        caption: action.caption
      }
    default:
      return state
  }
}
