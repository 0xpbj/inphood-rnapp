import { 
  LOGIN_SUCCESS, CLARIFAI_AUTH_SUCCESS, CLARIFAI_AUTH_ERROR,
  CLARIFAI_TAGS_SUCCESS, CLARIFAI_TAGS_ERROR,
  STORE_64_PHOTO, STORE_64_LIBRARY,
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

const getCVData = (data) => {
  return vision.models.predict(clarifai.FOOD_MODEL, {base64: data})
  .then(response => ({ response }))
  // .then(response => console.log(response))
}

function* getCameraData() {
  while(true) {
    try {
      yield take(STORE_64_PHOTO)
      const data = yield select(state => state.camReducer.photo64)
      const response = yield call(getCVData, data)
      if (response) {
        const tag0 = response.response.data.outputs[0].data.concepts[0].name
        const tag1 = response.response.data.outputs[0].data.concepts[1].name
        const tag2 = response.response.data.outputs[0].data.concepts[2].name
        const tags = { tag0, tag1, tag2 }
        yield put({type: CLARIFAI_TAGS_SUCCESS, tags})
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
      yield take(STORE_64_LIBRARY)
      const data = yield select(state => state.libReducer.selected64)
      const response = yield call(getCVData, data)
      if (response) {
        const tag0 = response.response.data.outputs[0].data.concepts[0].name
        const tag1 = response.response.data.outputs[0].data.concepts[1].name
        const tag2 = response.response.data.outputs[0].data.concepts[2].name
        const tags = tag0 + ', ' + tag1 + ', ' + tag2
        yield put({type: CLARIFAI_TAGS_SUCCESS, tags})
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