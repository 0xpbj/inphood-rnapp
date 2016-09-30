import { } from '../constants/ActionTypes'
import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import config from 'react-native-config'
import firebase from 'firebase'
import clarifai from 'clarifai'

const turlHead = config.AWS_CDN_THU_URL

// get a token
function getToken() {
  clarifai.getToken().then(
    handleResponse,
    handleError
  )
}

// get tags with an array of images
function getTags() {
  clarifai.getTagsByUrl([
    'https://samples.clarifai.com/wedding.jpg',
    'https://samples.clarifai.com/cookies.jpeg'
  ]).then(
    handleResponse,
    handleError
  )
}

// select which tags are returned
function selectClasses() {
  clarifai.getTagsByUrl(
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
function getInfo() {
  clarifai.getInfo().then(
    handleResponse,
    handleError
  )
}

// get languages
function getLanguages() {
  clarifai.getLanguages().then(
    handleResponse,
    handleError
  )
}

// get colors
function getColors() {
  clarifai.getColorsByUrl('https://samples.clarifai.com/wedding.jpg').then(
    handleResponse,
    handleError
  )
}

// get api usage
function getUsage() {
  clarifai.getUsage().then(
    handleResponse,
    handleError
  )
}

// create feedback
function createFeedback() {
  clarifai.createFeedback('https://samples.clarifai.com/wedding.jpg', {
    'addTags': ['family', 'friends',],
    'removeTags': ['military', 'protest'],
  }).then(
    handleResponse,
    handleError
  )
}

function handleResponse(response){
  console.log('promise response:', JSON.stringify(response))
}

function handleError(err){
  console.log('promise error:', err)
}