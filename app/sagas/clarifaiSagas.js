import { 
  LOGIN_SUCCESS, CLARIFAI_AUTH_SUCCESS, CLARIFAI_AUTH_ERROR,
  CLARIFAI_TAGS_SUCCESS, CLARIFAI_TAGS_ERROR,
  TAKE_PHOTO, SELECT_PHOTO,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import config from 'react-native-config'
import RNFS from 'react-native-fs'
import firebase from 'firebase'

const clarifaiClientId = config.CLARIFAI_CLIENT_ID
const clarifaiClientSecret = config.CLARIFAI_CLIENT_SECRET
const clarifai = require('clarifai')
const vision = new clarifai.App(
  clarifaiClientId,
  clarifaiClientSecret
)

const turlHead = config.AWS_CDN_THU_URL

const getToken = () => {
  return vision.getToken().then((token, error) => {})
}

function* authClarifai() {
  try {
    const {token, error} = yield call (getToken)
    console.log('after' + token)
    yield put({type: CLARIFAI_AUTH_SUCCESS})
  }
  catch(error) {
    console.log('in error')
    yield put({type: CLARIFAI_AUTH_ERROR})
  }
}

const get64Data = (path) => {
  console.log('in get 64 data: ' + path)
  return RNFS.readFile(path, 'base64')
  .then( 
    (res) => {console.log(res)}
  )
  .catch(
    (error) => {console.log(error)}
  )
}

const getTags = () => {
  return vision.models.predict(clarifai.FOOD_MODEL, 'https://samples.clarifai.com/cookies.jpeg')
  .then(
    (response) => {
      console.log(response)
    },
    (error) => {console.log(error)}
  )
}

// get api usage
const getUsage = () => {
  return vision.getUsage().then(
    (response) => {console.log(JSON.stringify(response))},
    (error) => {console.log(error)}
  )
}

const getStatus = () => {
  return vision.inputs.getStatus()
  .then(
    (response) => {
      console.log(response)
    },
    (err) => {console.log(response)}
  )
}

// function* getInputs() {
//   vision.inputs.get({1})
//   .then(
//     (response) => {
//       console.log(response)
//     },
//     (err) => {console.log(response)}
//   )
// }

function* getCameraData() {
  while(true) {
    yield take(TAKE_PHOTO)
    try {
      const path = yield select(state => state.camReducer.photo)
      yield call(getTags)
      yield call(getStatus)
      // yield call(getInputs)
      yield put({type: CLARIFAI_TAGS_SUCCESS})
    }
    catch (error) {
      yield put({type: CLARIFAI_TAGS_ERROR})
    }
  }
}

function* getLibraryData() {
  while(true) {
    yield take(SELECT_PHOTO)
    try {
      const path = yield select(state => state.libReducer.selected)
      const res = yield call(get64Data, path)
      console.log(res)
      if (res) {
        yield call(getTags)
        yield call(getStatus)
        // yield call(getInputs)
        yield put({type: CLARIFAI_TAGS_SUCCESS})
      }
    }
    catch (error) {
      yield put({type: CLARIFAI_TAGS_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, getToken)
  yield fork(takeLatest, LOGIN_SUCCESS, getCameraData)
  yield fork(takeLatest, LOGIN_SUCCESS, getLibraryData)
}