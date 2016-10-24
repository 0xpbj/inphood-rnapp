import { 
  TAKE_PHOTO, STORE_64_PHOTO, STORE_TITLE
} from '../constants/ActionTypes'

import { NavigationExperimental } from 'react-native'

const initialState = {
  photo: '',
  photo64: '',
  title: ''
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case TAKE_PHOTO:
      return {
        ...state,
        photo: action.photo
      }
    case STORE_64_PHOTO:
      return {
        ...state,
        photo64: action.photo
      }
    case STORE_TITLE:
      return {
        ...state,
        title: action.title
      }
    default:
      return state
  }
}
