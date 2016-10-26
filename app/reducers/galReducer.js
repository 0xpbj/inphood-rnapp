import { 
  INIT_PHOTOS,
  IS_NEW_USER,
  SEND_AWS_SUCCESS,
  REMOVE_CLIENT_PHOTO,
  LOAD_PHOTOS_SUCCESS,
  LOAD_PHOTOS_FAILURE,
  SEND_FIREBASE_CAMERA_SUCCESS,
} from '../constants/ActionTypes'

import Config from '../constants/config-vars'
const turlHead = Config.AWS_CDN_THU_URL

const initialState = {
  error: '',
  photos: [],
  newUser: false,
  isLoading: true,
  databasePaths: [],
  cdnPaths: [],
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
        isLoading: false,
        photos: [action.photo, ...state.photos],
        cdnPaths: [turlHead+action.photo.fileName, ...state.cdnPaths],
        databasePaths: [action.photo.databasePath, ...state.databasePaths],
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
        pictureLoading: true
      }
    case SEND_AWS_SUCCESS:
      return {
        ...state,
        pictureLoading: false
      }
    case REMOVE_CLIENT_PHOTO:
      const index = state.databasePaths.indexOf(action.path)
      if (index > -1) {
        let databasePaths = state.databasePaths
        databasePaths.splice(index, 1)
        let cdnPaths = state.cdnPaths
        cdnPaths.splice(index, 1)
        let photos = state.photos
        photos.splice(index, 1)
        return {
          ...state,
          photos: photos,
          cdnPaths: cdnPaths,
          databasePaths: databasePaths,
        }
      }
      else {
        return state
      }
    default:
      return state
  }
}