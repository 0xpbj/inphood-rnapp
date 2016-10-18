import {
  LOGIN_SUCCESS, ADD_MESSAGES, REFRESH_CLIENT_DATA, REMOVE_CLIENT_PHOTO,
  LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_ERROR, INIT_MESSAGES, INIT_PHOTOS,
  APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_ERROR, SEND_AWS_SUCCESS, IS_NEW_USER,
  syncAddedGalleryChild, syncRemovedGalleryChild,
  SYNC_ADDED_GALLERY_CHILD, SYNC_REMOVED_GALLERY_CHILD,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest, takeEvery } from 'redux-saga'
import { Image } from "react-native"
import Config from '../constants/config-vars'
import * as db from './firebaseCommands'

import firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

function* updateDataVisibility() {
  while (true) {
    const data = yield take(REMOVE_CLIENT_PHOTO)
    firebase.database().ref(data.path).update({'visible': false})
  }
}

const prefetchData = (photo) => {
  return Image.prefetch(photo)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + photo)})
}

const isLocalFile = (localFile) => {
  return RNFetchBlob.fs.exists(localFile)
    .then(flag => ({ flag }))
    .catch(error => ({ error }))
}

function* triggerGetGalleryChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GALLERY_CHILD)
    if (data.val().visible) {
      const file = data.val()
      const fileName = file.fileName
      const photo = turlHead+fileName
      const caption = file.caption
      const title = file.title
      const mealType = file.mealType
      const time = file.time
      const localFile = file.localFile
      const notification = file.notifyClient
      const obj = {photo,caption,mealType,time,title,localFile,data:file,notification}
      yield put ({type: APPEND_PHOTOS_SUCCESS, appendPhotos: obj})
    }
  }
}

function* triggerRemGalleryChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_GALLERY_CHILD)
    const child = data
  }
}

function* syncPhotoData() {
  let uid = yield select(state => state.authReducer.token)
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  let path = '/global/' + uid + '/photoData'
  yield fork(db.sync, path, {
    child_added: syncAddedGalleryChild,
    child_removed: syncRemovedGalleryChild,
  })
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, syncPhotoData)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerGetGalleryChild)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerRemGalleryChild)
  yield fork(takeLatest, LOGIN_SUCCESS, updateDataVisibility)
}