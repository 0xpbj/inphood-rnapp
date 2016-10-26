import { 
  INIT_PHOTOS,
  IS_NEW_USER,
  SEND_AWS_SUCCESS,
  LOAD_PHOTOS_SUCCESS,
  LOAD_PHOTOS_FAILURE,
  SEND_FIREBASE_CAMERA_SUCCESS,
} from '../constants/ActionTypes'

const initialState = {
  count: 0,
  error: '',
  photos: [],
  databasePaths: [],
  filter: '',
  newUser: false,
  isLoading: true,
  pictureLoading: null,
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
        databasePaths: [...state.databasePaths, action.photo.databasePath],
        isLoading: false
      }
    case LOAD_PHOTOS_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false
      }
    case SEND_FIREBASE_CAMERA_SUCCESS:
      return {
        ...state,
        count: state.count + 1,
        pictureLoading: true
      }
    case SEND_AWS_SUCCESS:
      return {
        ...state,
        pictureLoading: false
      }
    default:
      return state
  }
}