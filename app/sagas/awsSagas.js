import {
LOGIN_SUCCESS, SEND_AWS_SUCCESS, SEND_AWS_ERROR, STORE_SETTINGS_FORM,
SEND_FIREBASE_INIT_CAMERA, SEND_FIREBASE_INIT_LIBRARY,
SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_ERROR,
STORE_PROFILE_PICTURE, STORE_CDN_PICTURE
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import { Image } from "react-native"
import { RNS3 } from 'react-native-aws3'
import Config from 'react-native-config'

import DeviceInfo from 'react-native-device-info'
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
const deviceId = DeviceInfo.getUniqueID()

function* watchProfilePicCall() {
  try {
    const localPicture = yield select(state => state.authReducer.localProfilePicture)
    const fileName = deviceId + '/profile/' + Date.now() + '/image.jpg'
    yield call (sendToAWS, localPicture, fileName)
    const picture = turlHead+fileName
    firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({
      localPicture,
      picture,
    })
    yield put({type: STORE_CDN_PICTURE, picture})
  }
  catch(error) {
    yield put ({type: SEND_FIREBASE_ERROR, error})
  }
}

const prefetchData = (cdnPath) => {
  const delay = Date.now() + 5000
  while (Date.now() < delay) {
    // console.log('waiting...')
  }
  return Image.prefetch(cdnPath)
    .then(() => {/*console.log('Data fetched: ', cdnPath)*/})
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

const prepFirebase = (uid) => {
  if (uid) {
    const fileTail = firebase.database().ref('/global/' + deviceId + '/photoData').push().key
    const fileName = deviceId + '/' + fileTail + '.jpg'
    const data = {fileTail, fileName}
    return data
  }
  else
    throw 'User not authenticated'
}

const sendToFirebase = (uid, cReducer, sReducer, fileTail, fileName) => {
  if (uid) {
    let time = Date.now()
    let caption = ''
    let mealType = ''
    let title = ''
    let localFile = ''
    const notifyTrainer = true
    const notifyClient = false
    const visible = true
    caption = cReducer.caption
    title = sReducer.title
    mealType = cReducer.mealType
    localFile = sReducer.photo
    const databasePath = '/global/' + deviceId + '/photoData/' + fileTail
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
      databasePath,
      deviceId
    })
  }
  else
    throw 'User not authenticated'
}

function* loadFirebaseCall() {
  try {
    let {uid} = yield select(state => state.authReducer)
    if (!uid)
      uid = firebase.auth().currentUser.uid
    const cReducer = yield select(state => state.captionReducer)
    const sReducer = yield select(state => state.selectedReducer)
    const {fileTail, fileName} = yield call (prepFirebase, uid)
    yield call(sendToFirebase, uid, cReducer, sReducer, fileTail, fileName)
    yield put ({type: SEND_FIREBASE_CAMERA_SUCCESS})
    yield fork(loadAWSCall, fileName)
  }
  catch(error) {
    yield put ({type: SEND_FIREBASE_ERROR, error})
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, SEND_FIREBASE_INIT_CAMERA, loadFirebaseCall)
  yield fork(takeLatest, STORE_PROFILE_PICTURE, watchProfilePicCall)
}
