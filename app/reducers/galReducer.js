import { 
  IS_NEW_USER, 
  FILTER_PHOTOS, 
  SEND_FIREBASE_LIBRARY_SUCCESS, 
  SEND_FIREBASE_CAMERA_SUCCESS, 
  FEEDBACK_PHOTO, 
  LOAD_PHOTOS_SUCCESS, 
  LOAD_PHOTOS_FAILURE, 
  APPEND_PHOTOS_SUCCESS, 
  APPEND_PHOTOS_FAILURE,
  LOGIN_SUCCESS,
  INIT_PHOTOS
} from '../constants/ActionTypes'

const initialState = {
  photos: [],
  count: 0,
  error: '',
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
    case LOAD_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: action.photos,
        isLoading: false
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
        newUser: action.flag,
        isLoading: false
      }
    case APPEND_PHOTOS_SUCCESS:
      return {
        ...state,
        photos: [action.appendPhotos, ...state.photos],
        isLoading: false
      }
    case LOAD_PHOTOS_FAILURE:
    case APPEND_PHOTOS_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false
      }
    default:
      return state
  }
}
