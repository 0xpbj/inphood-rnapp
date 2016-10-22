import { 
  INIT_PHOTOS,
  IS_NEW_USER,
  LOAD_PHOTOS_SUCCESS,
  LOAD_PHOTOS_FAILURE,
  SEND_FIREBASE_CAMERA_SUCCESS,
  SEND_FIREBASE_LIBRARY_SUCCESS,
} from '../constants/ActionTypes'

const initialState = {
  count: 0,
  error: '',
  photos: [],
  filter: '',
  newUser: false,
  isLoading: true,
}

export default function gallery(state = initialState, action) {
  switch(action.type) {
    case INIT_PHOTOS:
      return {
        ...state,
        isLoading: true
      }
    case IS_NEW_USER:
      return {
        ...state,
        newUser: action.flag,
        isLoading: false
      }
    case LOAD_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: [action.photo, ...state.photos],
        isLoading: false
      }
    case LOAD_PHOTOS_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false
      }
    case SEND_FIREBASE_LIBRARY_SUCCESS:
    case SEND_FIREBASE_CAMERA_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
      }
    default:
      return state
  }
}