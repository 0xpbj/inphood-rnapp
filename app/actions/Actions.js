import {
  PUSH_EXP_ROUTE,
  POP_EXP_ROUTE,
  POP_GAL_ROUTE,
  PUSH_GAL_ROUTE,
  POP_CAM_ROUTE,
  PUSH_CAM_ROUTE,
  POP_LIB_ROUTE,
  PUSH_LIB_ROUTE,
  PUSH_EXT_ROUTE,
  POP_EXT_ROUTE,
  CHANGE_TAB,
  TAKE_PHOTO,
  SELECT_PHOTO,
  FEEDBACK_PHOTO,
  LOAD_PHOTOS_INIT,
  LOAD_PHOTOS_SUCCESS,
  LOAD_PHOTOS_ERROR,
  TAKE_PICTURE,
  LOAD_PICTURE,
  SEND_FIREBASE_LIBRARY_SUCCESS,
  SEND_FIREBASE_CAMERA_SUCCESS,
  SEND_FIREBASE_ERROR,
  SEND_FIREBASE_INIT_CAMERA,
  SEND_FIREBASE_INIT_LIBRARY,
  STORE_TRAINER,
  STORE_TOKEN,
  STORE_RESULT,
  STORE_CAMERA_CAPTION,
  STORE_LIBRARY_CAPTION,
  STORE_CAMERA_TITLE,
  STORE_LIBRARY_TITLE,
  ADD_CAMERA_MEAL_DATA,
  ADD_LIBRARY_MEAL_DATA,
  STORE_MESSAGES,
  REMOVE_CLIENT_PHOTO,
  MARK_MESSAGE_READ,
  MARK_PHOTO_READ,
  LOAD_ID,
  INIT_CHAT_SAGA,
  INIT_TRAINER_CHAT_SAGA,
  LOGIN_REQUEST,
  EM_LOGIN_REQUEST,
  EM_CREATE_USER,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_ERRROR,
  IS_NEW_USER,
  SET_CLIENT_ID,
  SET_CLIENT_PHOTO,
  SET_CLIENT_NAME,
} from '../constants/ActionTypes'

export function pushExp (route) {
  return {
    type: PUSH_EXP_ROUTE,
    route,
  }
}

export function popExp () {
  return {
    type: POP_EXP_ROUTE
  }
}

export function pushGal (route) {
  return {
    type: PUSH_GAL_ROUTE,
    route,
  }
}

export function popGal () {
  return {
    type: POP_GAL_ROUTE
  }
}

export function pushCam (route) {
  return {
    type: PUSH_CAM_ROUTE,
    route,
  }
}

export function popCam () {
  return {
    type: POP_CAM_ROUTE
  }
}

export function pushLib (route) {
  return {
    type: PUSH_LIB_ROUTE,
    route,
  }
}

export function popLib () {
  return {
    type: POP_LIB_ROUTE
  }
}

export function pushExt (route) {
  return {
    type: PUSH_EXT_ROUTE,
    route,
  }
}

export function popExt () {
  return {
    type: POP_EXT_ROUTE
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

export function feedbackPhoto (feedbackPhoto) {
  return {
    type: FEEDBACK_PHOTO,
    feedbackPhoto
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

export function loadPhotosError(error) {
  return {
    type: LOAD_PHOTOS_ERROR,
    error: error
  }
}

export function sendFirebaseInitCamera() {
  return {
    type: SEND_FIREBASE_INIT_CAMERA,
  }
}

export function sendFirebaseInitLibrary() {
  return {
    type: SEND_FIREBASE_INIT_LIBRARY,
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

export function storeCameraTitle(title) {
  return {
    type: STORE_CAMERA_TITLE,
    title
  }
}


export function storeLibraryTitle(title) {
  return {
    type: STORE_LIBRARY_TITLE,
    title
  }
}

export function addCameraMealData(mealType) {
  return {
    type: ADD_CAMERA_MEAL_DATA,
    mealType
  }
}

export function addLibraryMealData(mealType) {
  return {
    type: ADD_LIBRARY_MEAL_DATA,
    mealType
  }
}

export function storeMessages(messages) {
  return {
    type: STORE_MESSAGES,
    messages
  }
}

export function markMessageRead(path, trainer, photo, uid) {
  return {
    type: MARK_MESSAGE_READ,
    path,
    trainer,
    photo,
    uid
  }
}

export function markPhotoRead(path, photo, uid) {
  return {
    type: MARK_PHOTO_READ,
    path,
    photo,
    uid
  }
}

export function removeClientPhoto(path) {
  return {
    type: REMOVE_CLIENT_PHOTO,
    path
  }
}

export function storeId(id) {
  return {
    type: LOAD_ID,
    id
  }
}

export function initChatSaga() {
  return {
    type: INIT_CHAT_SAGA,
  }
}

export function storeTrainer(flag) {
  return {
    type: STORE_TRAINER,
    flag
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

export function emailLoginRequest(value){
  return {
    type: EM_LOGIN_REQUEST,
    value
  }
}

export function emailCreateUser(value){
  return {
    type: EM_CREATE_USER,
    value
  }
}

export function loginSuccess(){
  return {
    type: LOGIN_SUCCESS
  }
}

export function loginError(error){
  return {
    type: LOGIN_ERROR,
    error: error
  }
}

// triggered to logout the user
export function logoutRequest(){
  return {
    type: LOGOUT_REQUEST
  }
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

export function isNewUser(flag){
  return {
    type: IS_NEW_USER,
    flag: flag
  }
}

export function setClientId(id) {
  return {
    type: SET_CLIENT_ID,
    id: id
  }
}

export function setClientPhoto(photo) {
  return {
    type: SET_CLIENT_PHOTO,
    photo: photo
  }
}

export function setClientName(name) {
  return {
    type: SET_CLIENT_NAME,
    name: name
  }
}