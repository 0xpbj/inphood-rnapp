import { LOGIN_SUCCESS } from '../constants/ActionTypes'
import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import config from 'react-native-config'
import firebase from 'firebase'

const turlHead = config.AWS_CDN_THU_URL
const clarifaiClientId = config.CLARIFAI_CLIENT_ID
const clarifaiClientSecret = config.CLARIFAI_CLIENT_SECRET

var clarifai = require('clarifai')
var vision = new clarifai.App(
  clarifaiClientId,
  clarifaiClientSecret
)

// get a token
function* getToken() {
  vision.getToken()
  .then((token, error) => {})
  .catch((error) => {console.log(error)})
}

// get tags with an array of images
function* getTags() {
  vision.getTagsByUrl([
    'https://samples.clarifai.com/wedding.jpg',
    'https://samples.clarifai.com/cookies.jpeg'
  ])
  .then((token, error) => {})
  .catch((error) => {console.log(error)})
}

// select which tags are returned
function* selectClasses() {
  vision.getTagsByUrl(
    'https://samples.clarifai.com/wedding.jpg',
    {
      'selectClasses': ['people', 'dress', 'wedding']
    }
  ).then(
    handleResponse,
    handleError
  )
}

// get api info
function* getInfo() {
  vision.getInfo().then(
    handleResponse,
    handleError
  )
}

// get languages
function* getLanguages() {
  vision.getLanguages().then(
    handleResponse,
    handleError
  )
}

// get colors
function* getColors() {
  vision.getColorsByUrl('https://samples.clarifai.com/wedding.jpg').then(
    handleResponse,
    handleError
  )
}

// get api usage
function* getUsage() {
  vision.getUsage().then(
    handleResponse,
    handleError
  )
}

// create feedback
function* createFeedback() {
  vision.createFeedback('https://samples.clarifai.com/wedding.jpg', {
    'addTags': ['family', 'friends',],
    'removeTags': ['military', 'protest'],
  }).then(
    handleResponse,
    handleError
  )
}

function* handleResponse(response){
  console.log('Respons!')
  console.log('promise response:', JSON.stringify(response))
}

function* handleError(err){
  console.log('promise error:', err)
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, getToken)
  // yield fork(takeLatest, LOGIN_SUCCESS, getTags)
}