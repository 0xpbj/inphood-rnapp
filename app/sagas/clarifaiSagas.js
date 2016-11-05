import { 
  LOGIN_SUCCESS, CLARIFAI_AUTH_SUCCESS, CLARIFAI_AUTH_ERROR,
  CLARIFAI_TAGS_SUCCESS, CLARIFAI_TAGS_ERROR, STORE_64_PHOTO
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import config from '../constants/config-vars'
import RNFS from 'react-native-fs'

const clarifaiClientId = config.CLARIFAI_CLIENT_ID
const clarifaiClientSecret = config.CLARIFAI_CLIENT_SECRET
const clarifai = require('clarifai')
const vision = new clarifai.App(
  clarifaiClientId,
  clarifaiClientSecret
)

const testCV = () => {
  vision.models.predict(clarifai.FOOD_MODEL, 'https://samples.clarifai.com/cookies.jpeg')
  .then(response => console.log(response))
}

const get64Data = (file) => {
  RNFS.readFile(file.substring(7), 'base64')
  .then((data) => {
    return getCVData(data)
  })
  .catch(err => {
    console.log(err)
  })
}

const getTags = (response) => {
  const {concepts} = response.response.data.outputs[0].data
  let tags = ''
  for (let id in concepts) {
    if (concepts[id].value > 0.80) {
      if (tags === '') {
        tags = concepts[id].name
      }
      else {
        tags = tags + ', ' + concepts[id].name
      }
    }
  }
  return tags
}

const getCVData = (data) => {
  return vision.models.predict(clarifai.FOOD_MODEL, {base64: data})
  .then(response => ({ response }))
}

function* getCameraData() {
  while(true) {
    try {
      let response = ''
      yield take(STORE_64_PHOTO)
      const data = yield select(state => state.selectedReducer.photo64)
      if (data === '') {
        const file = yield select(state => state.selectedReducer.photo)
        response = yield call(get64Data, file)
      }
      else {
        response = yield call(getCVData, data)
      }
      if (response) {
        const tags = yield call(getTags, response)
        yield put({type: CLARIFAI_TAGS_SUCCESS, tags})
      }
    }
    catch (error) {
      yield put({type: CLARIFAI_TAGS_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], getCameraData)
}