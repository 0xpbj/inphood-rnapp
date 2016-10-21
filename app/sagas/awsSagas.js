import {
LOGIN_SUCCESS, SEND_AWS_SUCCESS, SEND_AWS_ERROR, STORE_SETTINGS_FORM,
SEND_FIREBASE_INIT_CAMERA, SEND_FIREBASE_INIT_LIBRARY,
SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_ERROR,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

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
  .catch(err => {
    console.log('Errors uploading: ' + err)
  })
}

function* loadAWSCall(flag, fileName) {
  try {
    let image = ''
    if (flag) {
      image = yield select(state => state.camReducer.photo)
    }
    else {
      image = yield select(state => state.libReducer.selected)
    }
    yield call (sendToAWS, image, fileName)
    yield put ({type: SEND_AWS_SUCCESS})
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
  const key = firebase.database().ref('/global/' + uid + '/photoData').push()
  const fileTail = key.path.o[3]
  const fileName = uid + '/' + fileTail + '.jpg'
  const data = {fileTail, fileName}
  return data
}

const sendToFirebase = (state, flag, fileTail, fileName) => {
  let uid = state.authReducer.token
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  let result = state.authReducer.result
  let name = result.name
  let id = result.id
  let picture = result.picture
  let time = Date.now()
  firebase.database().ref('/global/' + uid + '/userInfo/public').update({
    id,
    name,
    picture,
  })
  let caption = ''
  let mealType = ''
  let title = ''
  let localFile = ''
  const notifyTrainer = true
  const notifyClient = false
  const visible = true
  if (flag) {
    caption = state.camReducer.caption
    title = state.camReducer.title
    mealType = state.camReducer.mealType
    localFile = state.camReducer.photo
  }
  else {
    caption = state.libReducer.caption
    title = state.libReducer.title
    mealType = state.libReducer.mealType
    localFile = state.libReducer.selected
  }
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

function* loadFirebaseCall(flag) {
  try {
    const state = yield select()
    const {fileTail, fileName} = yield call (prepFirebase, state)
    if (flag) {
      yield put ({type: SEND_FIREBASE_CAMERA_SUCCESS})
      yield call(loadAWSCall, true, fileName)
    }
    else {
      yield put ({type: SEND_FIREBASE_LIBRARY_SUCCESS})
      yield call(loadAWSCall, false, fileName)
    }
    yield call (sendToFirebase, state, flag, fileTail, fileName)
  }
  catch(error) {
    console.log(error)
    yield put ({type: SEND_FIREBASE_ERROR, error})
  }
}

const sendUserDataToFirebase = (form, state) => {
  console.log(form)
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

function* watchFirebaseCameraCall() {
  while(true) {
    yield take(SEND_FIREBASE_INIT_CAMERA)
    yield call(loadFirebaseCall, true)
  }
}

function* watchFirebaseLibraryCall() {
  while(true) {
    yield take(SEND_FIREBASE_INIT_LIBRARY)
    yield call(loadFirebaseCall, false)
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, watchFirebaseLibraryCall)
  yield fork(takeLatest, LOGIN_SUCCESS, watchFirebaseCameraCall)
  yield fork(takeLatest, LOGIN_SUCCESS, watchUserDataCall)
}
