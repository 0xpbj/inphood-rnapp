import {
SEND_AWS_SUCCESS, SEND_AWS_ERROR,
SEND_FIREBASE_INIT_CAMERA, SEND_FIREBASE_INIT_LIBRARY,
SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_ERROR,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

import { RNS3 } from 'react-native-aws3'
import Config from 'react-native-config'

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

const sendToFirebase = (state, flag) => {
  let result = state.authReducer.result
  let uid = firebase.auth().currentUser.uid
  let name = result.name
  let id = result.id
  let picture = result.picture
  let time = Date.now()
  firebase.database().ref('/global/' + uid + '/userInfo/public').update({
    id,
    name,
    picture,
  })
  let key = firebase.database().ref('/global/' + uid + '/photoData').push()
  let fileTail = key.path.o[3]
  let fileName = uid + '/' + fileTail + '.jpg'
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
  key.set({
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
    notifyClient
  })
  return fileName
}

function* loadFirebaseCall(flag) {
  try {
    const state = yield select()
    let fileName = yield call (sendToFirebase, state, flag)
    if (flag) {
      yield put ({type: SEND_FIREBASE_CAMERA_SUCCESS})
      yield call(loadAWSCall, true, fileName)
    }
    else {
      yield put ({type: SEND_FIREBASE_LIBRARY_SUCCESS})
      yield call(loadAWSCall, false, fileName)
    }
  }
  catch(error) {
    console.log(error)
    yield put ({type: SEND_FIREBASE_ERROR, error})
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
  yield fork(watchFirebaseLibraryCall)
  yield fork(watchFirebaseCameraCall)
}
