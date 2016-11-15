import {
  PUSH_EXP_ROUTE,
  POP_EXP_ROUTE,
  POP_GAL_ROUTE,
  PUSH_GAL_ROUTE,
  POP_CAM_ROUTE,
  PUSH_CAM_ROUTE,
  PUSH_EXT_ROUTE,
  POP_EXT_ROUTE,
  PUSH_GRP_ROUTE,
  POP_GRP_ROUTE,
  CHANGE_TAB,
  CHANGE_PAGE,
  SETTINGS_VIEW,
  TAKE_PHOTO,
  STORE_64_PHOTO,
  FEEDBACK_PHOTO,
  LOAD_PHOTOS_INIT,
  LOAD_PHOTOS_SUCCESS,
  LOAD_PHOTOS_ERROR,
  TAKE_PICTURE,
  LOAD_PICTURE,
  RESET_CAMERA,
  RESET_LIBRARY,
  SEND_FIREBASE_CAMERA_SUCCESS,
  SEND_FIREBASE_ERROR,
  SEND_FIREBASE_INIT_CAMERA,
  STORE_TOKEN,
  STORE_CAPTION,
  STORE_TITLE,
  ADD_MEAL_DATA,
  STORE_MESSAGES,
  REMOVE_CLIENT_PHOTO,
  MARK_PHOTO_READ,
  MARK_CLIENT_PHOTO_READ,
  LOAD_ID,
  LOAD_GROUP,
  INIT_CHAT_SAGA,
  INIT_TRAINER_CHAT_SAGA,
  LOGIN_REQUEST,
  CREATE_GROUP,
  ADD_GROUPS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_ERRROR,
  IS_NEW_USER,
  SET_CLIENT_ID,
  SET_CLIENT_PHOTO,
  SET_CLIENT_NAME,
  SET_GROUP_NAME,
  STORE_SETTINGS_FORM,
  STORE_GROUP_FORM,
  USER_SETTINGS,
  RESET_PASSWORD,
  CLIENT_APP_INVITE,
  FRIEND_APP_INVITE,
  CLEAR_CLIENT_ALERT,
  CLEAR_TRAINER_ALERT,
  BRANCH_AUTH_SETUP,
  STORE_PROFILE_PICTURE,
  STORE_USER_NAME,
  REMOVE_TRAINER,
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

export function pushGrp (route) {
  return {
    type: PUSH_GRP_ROUTE,
    route,
  }
}

export function popGrp () {
  return {
    type: POP_GRP_ROUTE
  }
}

export function changeTab (index) {
  return {
    type: CHANGE_TAB,
    index
  }
}

export function goToSettings (flag) {
  return {
    type: SETTINGS_VIEW,
    flag
  }
}
export function changePage (index) {
  return {
    type: CHANGE_PAGE,
    index
  }
}

export function takePhoto (photo) {
  return {
    type: TAKE_PHOTO,
    photo
  }
}

export function store64Data (photo) {
  return {
    type: STORE_64_PHOTO,
    photo
  }
}

export function feedbackPhoto (databasePath, cdnPath) {
  return {
    type: FEEDBACK_PHOTO,
    databasePath,
    cdnPath
  }
}

export function loadPhotosInit() {
  return {
    type: LOAD_PHOTOS_INIT,
  }
}

export function loadPhotosSuccess(photo) {
  return {
    type: LOAD_PHOTOS_SUCCESS,
    photos: photo,
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

export function storeCaption(caption) {
  return {
    type: STORE_CAPTION,
    caption
  }
}

export function storeTitle(title) {
  return {
    type: STORE_TITLE,
    title
  }
}

export function addMealData(mealType) {
  return {
    type: ADD_MEAL_DATA,
    mealType
  }
}

export function storeMessages(messages) {
  return {
    type: STORE_MESSAGES,
    messages
  }
}

export function markPhotoRead(path, photo) {
  return {
    type: MARK_PHOTO_READ,
    path,
    photo,
  }
}

export function markClientPhotoRead(path, photo, uid) {
  return {
    type: MARK_CLIENT_PHOTO_READ,
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

export function storeGroup(group) {
  return {
    type: LOAD_GROUP,
    group
  }
}

export function initChatSaga() {
  return {
    type: INIT_CHAT_SAGA,
  }
}

export function storeToken(token) {
  return {
    type: STORE_TOKEN,
    token
  }
}

export function loginRequest(){
  return {
    type: LOGIN_REQUEST
  };
}

export function createGroup(value){
  return {
    type: CREATE_GROUP,
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

export function setGroupName(name, photo) {
  return {
    type: SET_GROUP_NAME,
    name,
    photo
  }
}

export function storeSettingsForm(form) {
  return {
    type: STORE_SETTINGS_FORM,
    form: form
  }
}

export function storeGroupForm(form) {
  return {
    type: STORE_GROUP_FORM,
    form: form
  }
}

export function storeUserSettings(settings) {
  return {
    type: USER_SETTINGS,
    settings: settings
  }
}

export function callResetPassword() {
  return {
    type: RESET_PASSWORD
  }
}

export function sendClientAppInvite(name) {
  return {
    type: CLIENT_APP_INVITE,
    referralType: 'client',
    name
  }
}

export function sendFriendAppInvite(name) {
  return {
    type: FRIEND_APP_INVITE,
    referralType: 'friend',
    name
  }
}

export function clearClientAlert() {
  return {
    type: CLEAR_CLIENT_ALERT
  }
}

export function clearTrainerAlert() {
  return {
    type: CLEAR_TRAINER_ALERT
  }
}

export function setBranchAuthSetup(response) {
  return {
    type: BRANCH_AUTH_SETUP,
    response
  }
}

export function resetCameraProgress() {
  return {
    type: RESET_CAMERA
  }
}

export function storeProfilePicture(image) {
  return {
    type: STORE_PROFILE_PICTURE,
    image
  }
}

export function storeUserName(name) {
  return {
    type: STORE_USER_NAME,
    name
  }
}

export function removeTrainer() {
  return {
    type: REMOVE_TRAINER
  }
}
