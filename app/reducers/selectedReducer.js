import { 
  TAKE_PHOTO, SELECT_PHOTO, 
  STORE_64_PHOTO, STORE_64_LIBRARY, 
  STORE_CAMERA_TITLE, STORE_LIBRARY_TITLE, 
} from '../constants/ActionTypes'

import { NavigationExperimental } from 'react-native'

const initialState = {
  photo: '',
  photo64: '',
  library: '',
  library64: '',
  libTitle: '',
  camTitle: ''
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case TAKE_PHOTO:
      return {
        ...state,
        photo: action.photo
      }
    case SELECT_PHOTO:
      return {
        ...state,
        library: action.selected
      }
    case STORE_64_LIBRARY:
      return {
        ...state,
        library64: action.selected
      }
    case STORE_64_PHOTO:
      return {
        ...state,
        photo64: action.photo
      }
    case STORE_CAMERA_TITLE:
      return {
        ...state,
        camTitle: action.title
      }
    case STORE_LIBRARY_TITLE:
      return {
        ...state,
        libTitle: action.title
      }
    default:
      return state
  }
}
