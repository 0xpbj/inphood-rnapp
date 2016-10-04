import { 
  LOGIN_SUCCESS, CLARIFAI_AUTH_SUCCESS, CLARIFAI_AUTH_ERROR,
  CLARIFAI_TAGS_SUCCESS, CLARIFAI_TAGS_ERROR,
  TAKE_PHOTO, SELECT_PHOTO,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import config from 'react-native-config'
import firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const clarifaiClientId = config.CLARIFAI_CLIENT_ID
const clarifaiClientSecret = config.CLARIFAI_CLIENT_SECRET
const clarifai = require('clarifai')
const vision = new clarifai.App(
  clarifaiClientId,
  clarifaiClientSecret
)

const turlHead = config.AWS_CDN_THU_URL

const testCV = () => {
  vision.models.predict(clarifai.FOOD_MODEL, 'https://samples.clarifai.com/cookies.jpeg')
  .then(response => console.log(response))
}

const getCVData = (path) => {
  let data = ''
  return RNFetchBlob.fs.readStream(path, 'base64', 4095)
  .then((ifstream) => {
    ifstream.open()
    ifstream.onData((chunk) => {
      data += chunk
    })
    ifstream.onError((error) => {
      console.log('Error: ', error)
    })
    ifstream.onEnd(() => {
      return vision.models.predict(clarifai.FOOD_MODEL, {base64: data})
      // .then(response => ({ response }))
      .then(response => console.log(response))
    })
  })
}

function* getCameraData() {
  while(true) {
    try {
      yield take(TAKE_PHOTO)
      const path = yield select(state => state.camReducer.photo)
      const response = yield call(getCVData, path)
      if (response) {
        yield put({type: CLARIFAI_TAGS_SUCCESS})
      }
    }
    catch (error) {
      yield put({type: CLARIFAI_TAGS_ERROR})
    }
  }
}

function* getLibraryData() {
  while(true) {
    try {
      yield take(SELECT_PHOTO)
      const path = yield select(state => state.libReducer.selected)
      const response = yield call(getCVData, path)
      if (response) {
        yield put({type: CLARIFAI_TAGS_SUCCESS})
      }
    }
    catch (error) {
      console.log(error)
      yield put({type: CLARIFAI_TAGS_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(getCameraData)
  yield fork(getLibraryData)
}