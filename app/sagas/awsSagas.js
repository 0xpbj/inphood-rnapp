import {
LOGIN_SUCCESS, SEND_AWS_SUCCESS, SEND_AWS_ERROR, STORE_SETTINGS_FORM,
SEND_FIREBASE_INIT_CAMERA, SEND_FIREBASE_INIT_LIBRARY,
SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_ERROR,
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import { Image } from "react-native"
import { RNS3 } from 'react-native-aws3'
import Config from '../constants/config-vars'

import firebase from 'firebase'

let options = {
  keyPrefix: "data/",
  bucket: Config.AWS_BUCKET,
  region: Config.AWS_BUCKET_REGION,
  accessKey: Config.AWS_CONFIG_KEY,
  secretKey: Config.AWS_SECRET_KEY,
  successActionStatus: 201
}
const turlHead = Config.AWS_CDN_THU_URL

const prefetchData = (cdnPath) => {
  const delay = Date.now() + 5000
  while (Date.now() < delay) {
    // console.log('waiting...')
  }
  return Image.prefetch(cdnPath)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + cdnPath)})
}

const sendToAWS = (image, fileName) => {
  let imgfile = {
    uri : image,
    type: 'image/jpeg',
    name: fileName,
  }
  return RNS3.put(imgfile, options)
  .then(response => {
    if (response.status !== 201)
      throw new Error("Failed to upload image to S3")
  })
}

function* loadAWSCall(fileName) {
  try {
    const image = yield select(state => state.selectedReducer.photo)
    yield call (sendToAWS, image, fileName)
    yield put ({type: SEND_AWS_SUCCESS})
    const cdnPath = turlHead+fileName
    yield call (prefetchData, cdnPath)
  }
  catch(error) {
    yield put ({type: SEND_AWS_ERROR, error})
  }
}

const prepFirebase = (state) => {
  let uid = state.authReducer.token
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  const fileTail = firebase.database().ref('/global/' + uid + '/photoData').push().key
  const fileName = uid + '/' + fileTail + '.jpg'
  const data = {fileTail, fileName}
  return data
}

const sendToFirebase = (state, fileTail, fileName) => {
  let uid = state.authReducer.token
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  if (!state.authReducer.anonymous) {
    let result = state.authReducer.result
    let name = result.name
    let id = result.id
    let picture = result.picture
    firebase.database().ref('/global/' + uid + '/userInfo/public').update({
      id,
      name,
      picture,
    })
  }
  let time = Date.now()
  let caption = ''
  let mealType = ''
  let title = ''
  let localFile = ''
  const notifyTrainer = true
  const notifyClient = false
  const visible = true
  caption = state.captionReducer.caption
  title = state.selectedReducer.title
  mealType = state.captionReducer.mealType
  localFile = state.selectedReducer.photo
  const databasePath = '/global/' + uid + '/photoData/' + fileTail
  firebase.database().ref(databasePath).update({
    uid,
    fileName,
    fileTail,
    title,
    caption,
    mealType,
    localFile,
    time,
    notifyTrainer,
    visible,
    notifyClient,
    databasePath
  })
}

function* loadFirebaseCall() {
  try {
    const state = yield select()
    const {fileTail, fileName} = yield call (prepFirebase, state)
    yield call(sendToFirebase, state, fileTail, fileName)
    yield put ({type: SEND_FIREBASE_CAMERA_SUCCESS})
    yield fork(loadAWSCall, fileName)
  }
  catch(error) {
    yield put ({type: SEND_FIREBASE_ERROR, error})
  }
}

const sendUserDataToFirebase = (form, state) => {
  let uid = state.authReducer.token
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  const {birthday, height, diet, email, picture} = form
  firebase.database().ref('/global/' + uid + '/userInfo/public').update({
    birthday,
    height,
    diet,
    email,
    picture
  })
}

function* watchUserDataCall() {
  while(true) {
    const data = yield take(STORE_SETTINGS_FORM)
    const state = yield select()
    yield call(sendUserDataToFirebase, data.form, state)
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, SEND_FIREBASE_INIT_CAMERA, loadFirebaseCall)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], watchUserDataCall)
}
