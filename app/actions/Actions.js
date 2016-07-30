import {
  POP_ROUTE,
  PUSH_ROUTE,
  CHANGE_TAB,
  TAKE_PHOTO,
  SELECT_PHOTO,
  LOAD_PHOTOS_INIT,
  LOAD_PHOTOS_SUCCESS,
  LOAD_PHOTOS_FAILURE,
  TAKE_PICTURE,
  LOAD_PICTURE,
  LOAD_CAMERAMEDIA_SUCCESS,
  LOAD_CAMERAMEDIA_ERROR,
  SEND_AWS_INIT_CAMERA,
  SEND_AWS_INIT_LIBRARY,
  STORE_TOKEN,
  STORE_RESULT,
  STORE_CAMERA_CAPTION,
  STORE_LIBRARY_CAPTION,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_ERRROR
} from '../constants/ActionTypes'

export function push (route) {
  return {
    type: PUSH_ROUTE,
    route,
  }
}

export function pop () {
  return {
    type: POP_ROUTE
  }
}

export function changeTab (index) {
  return {
    type: CHANGE_TAB,
    index
  }
}

export function takePhoto (photo) {
  return {
    type: TAKE_PHOTO,
    photo
  }
}

export function selectPhoto (selected) {
  return {
    type: SELECT_PHOTO,
    selected
  }
}

export function loadPhotosInit() {
  return {
    type: LOAD_PHOTOS_INIT,
  }
}
export function loadPhotosSuccess(photos) {
  return {
    type: LOAD_PHOTOS_SUCCESS,
    photos: photos
  }
}

export function loadPhotosFailure(error) {
  return {
    type: LOAD_PHOTOS_FAILURE,
    error: error
  }
}

export function sendAWSInitCamera() {
  return {
    type: SEND_AWS_INIT_CAMERA,
  }
}

export function sendAWSInitLibrary() {
  return {
    type: SEND_AWS_INIT_LIBRARY,
  }
}

export function storeCameraCaption(caption) {
  return {
    type: STORE_CAMERA_CAPTION,
    caption
  }
}


export function storeLibraryCaption(caption) {
  return {
    type: STORE_LIBRARY_CAPTION,
    caption
  }
}

export function storeToken(token) {
  return {
    type: STORE_TOKEN,
    token
  }
}

export function storeResult(result) {
  return {
    type: STORE_RESULT,
    result
  }
}

export function loginRequest(){
  return {
    type: LOGIN_REQUEST
  };
}

export function loginSuccess(){
  return {
    type: LOGIN_SUCCESS
  };
}

export function loginError(error){
  return {
    type: LOGIN_ERROR,
    error: error
  };
}

// triggered to logout the user
export function logoutRequest(){
  return {
    type: LOGOUT_REQUEST
  };
}

export function logoutSuccess(){
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logoutError(error){
  return {
    type: LOGOUT_ERROR,
    error: error
  }
}
