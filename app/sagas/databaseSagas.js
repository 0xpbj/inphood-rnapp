import {
  LOGIN_SUCCESS, ADD_MESSAGES, REFRESH_CLIENT_DATA, REMOVE_CLIENT_PHOTO,
  LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_ERROR, INIT_MESSAGES, INIT_PHOTOS,
  SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_LIBRARY_SUCCESS,
  APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_ERROR,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import { Image } from "react-native"
import Config from 'react-native-config'
import * as db from './firebaseCommands'

import firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

function* updateDataVisibility() {
  while (true) {
    const data = yield take(REMOVE_CLIENT_PHOTO)
    firebase.database().ref(data.path).update({'visible': false})
    yield put({type: REFRESH_CLIENT_DATA})
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

function* firebaseData(flag) {
  try {
    let uid = yield select(state => state.authReducer.token)
    if (!uid) {
      uid = firebase.auth().currentUser.uid
    }
    let photos = []
    const path = '/global/' + uid + '/photoData'
    let vals = []
    if (flag) {
      vals = (yield call(db.getPath, path)).val()
    }
    else {
      vals = (yield call(db.getLastPath, path)).val()
    }
    for (let key in vals) {
      const data = vals[key]
      const visible = data.visible
      if (visible) {
        // let thumb = turlHead+data.fileName
        const fileName = data.fileName
        const photo = turlHead+fileName
        const caption = data.caption
        const title = data.title
        const mealType = data.mealType
        const time = data.time
        const localFile = data.localFile
        const notification = data.notifyClient
        yield fork(prefetchData, photo)
        const {flag, error} = yield call(isLocalFile, localFile)
        const obj = {photo,caption,mealType,time,title,localFile,flag,data,notification}
        photos.unshift(obj)
      }
    }
    if (flag) {
      yield put ({type: INIT_PHOTOS, flag: false})
      yield put ({type: LOAD_PHOTOS_SUCCESS, photos})
    }
    else if (photos[0]) {
      yield put ({type: APPEND_PHOTOS_SUCCESS, appendPhotos: photos[0]})
    }
  }
  catch(error) {
    yield put ({type: LOAD_PHOTOS_ERROR, error})
  }
}

function* appendFirebaseDataFlow() {
  while (true) {
    yield take([SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS])
    yield call(firebaseData, false)
  }
}

function* initFirebaseDataFlow() {
  while (true) {
    yield take([INIT_MESSAGES, REFRESH_CLIENT_DATA])
    yield put ({type: INIT_PHOTOS, flag: true})
    yield call(firebaseData, true)
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, initFirebaseDataFlow)
  yield fork(takeLatest, LOGIN_SUCCESS, appendFirebaseDataFlow)
  yield fork(takeLatest, LOGIN_SUCCESS, updateDataVisibility)
}
