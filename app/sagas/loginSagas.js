import {
  EM_LOGIN_REQUEST, EM_CREATE_USER, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR, RESET_PASSWORD,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR, STORE_RESULT, STORE_TOKEN, INIT_LOGIN, USER_SETTINGS,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import Config from 'react-native-config'
import firebase from 'firebase'
const defaultPicture = Config.AWS_CDN_IMG_URL + 'banana.jpg'

const FBSDK = require('react-native-fbsdk')
const { AccessToken } = FBSDK

const facebookLogin = () => {
  return AccessToken.getCurrentAccessToken()
  .then(token => {
    let credential = firebase.auth.FacebookAuthProvider.credential(token)
    return firebase.auth().signInWithCredential(credential)
    .then(user => ({ user }))
    .catch(error => ({ error }))
  })
}

function* fbloginFlow() {
  try {
    yield put ({type: INIT_LOGIN, flag: true})
    const {user, error} = yield call(facebookLogin)
    if (user) {
      const id = user.providerData[0].uid
      const name = user.providerData[0].displayName
      const picture = user.providerData[0].photoURL
      const provider = user.providerData[0].providerId
      const token = user.uid
      const path = '/global/' + token + '/userInfo/public'
      const trainerId = (yield call(db.getPath, path + '/trainerId')).val()
      const birthday = (yield call(db.getPath, path + '/birthday')).val()
      const email = (yield call(db.getPath, path + '/email')).val()
      const diet = (yield call(db.getPath, path + '/diet')).val()
      const height = (yield call(db.getPath, path + '/height')).val()
      const values = name.split(" ")
      const first_name = values[0]
      const last_name = values[1]
      const result = {id, name, picture, first_name, last_name, provider, trainerId}
      const userSettings = {first_name, last_name, birthday, height, diet, email, picture}
      yield put ({type: USER_SETTINGS, settings: userSettings})
      yield put ({type: STORE_RESULT, result})
      yield put ({type: STORE_TOKEN, token})
      yield put ({type: LOGIN_SUCCESS})
      firebase.database().ref('/global/' + token + '/userInfo/public').update({
        id,
        name,
        picture,
      })
    }
  }
  catch(error) {
    yield put ({type: LOGIN_ERROR, error})
    yield put ({type: INIT_LOGIN, flag: false})
  }
}

const emailCreate = (value) => {
  return firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
    .catch (error => {
      alert(error.message)
    }
  )
}

function* emailCreateFlow(value) {
  try {
    yield call(emailCreate, value)
    const user = firebase.auth().currentUser
    const id = user.providerData[0].uid
    const first_name = value.firstname
    const last_name = value.lastname
    const name = value.firstname + ' ' + value.lastname
    const picture = value.pictureURL ? value.pictureURL : defaultPicture
    const provider = user.providerData[0].providerId
    const token = user.uid
    const result = {id, name, picture, first_name, last_name, provider}
    yield put ({type: STORE_RESULT, result})
    yield put ({type: STORE_TOKEN, token})
    yield put ({type: LOGIN_SUCCESS})
    firebase.database().ref('/global/' + token + '/userInfo/public').update({
      id,
      name,
      picture,
    })
  }
  catch(error) {
    yield put ({type: LOGIN_ERROR, error})
    yield put ({type: INIT_LOGIN, flag: false})
  }
}

function* watchEMCreateFlow() {
  const data = yield take(EM_CREATE_USER)
  yield put ({type: INIT_LOGIN, flag: true})
  yield call(emailCreateFlow, data.value)
}


const emailLogin = (value) => {
  return firebase.auth().signInWithEmailAndPassword(value.email, value.password)
    .catch(error => {
      alert(error.message)
    }
  )
}

function* emloginFlow(value) {
  try {
    yield call(emailLogin, value)
    const user = firebase.auth().currentUser
    const token = user.uid
    const path = '/global/' + token + '/userInfo/public'
    const id = (yield call(db.getPath, path + '/id')).val()
    const name = (yield call(db.getPath, path + '/name')).val()
    const picture = (yield call(db.getPath, path + '/picture')).val()
    const birthday = (yield call(db.getPath, path + '/birthday')).val()
    const email = (yield call(db.getPath, path + '/email')).val()
    const diet = (yield call(db.getPath, path + '/diet')).val()
    const height = (yield call(db.getPath, path + '/height')).val()
    const trainerId = (yield call(db.getPath, path + '/trainerId')).val()
    const provider = user.providerData[0].providerId
    const values = name.split(" ")
    const first_name = values[0]
    const last_name = values[1]
    const result = {id, name, picture, first_name, last_name, provider, trainerId}
    const userSettings = {first_name, last_name, birthday, height, diet, email, picture}
    yield put ({type: USER_SETTINGS, settings: userSettings})
    yield put ({type: STORE_RESULT, result})
    yield put ({type: STORE_TOKEN, token})
    yield put ({type: LOGIN_SUCCESS})
  }
  catch(error) {
    yield put ({type: LOGIN_ERROR, error})
    yield put ({type: INIT_LOGIN, flag: false})
  }
}

function* watchEMLoginFlow() {
  const data = yield take(EM_LOGIN_REQUEST)
  yield put ({type: INIT_LOGIN, flag: true})
  yield call(emloginFlow, data.value)
}

const firebaseLogout = () => {
  return firebase.auth().signOut()
  .then(() => {
    return true
  }, (error) => {
  })
}

function* logoutFlow() {
  try {
    const success = yield call(firebaseLogout)
    if (success) {
      yield put ({type: LOGOUT_SUCCESS})
    }
  }
  catch(error) {
    yield put ({type: LOGOUT_ERROR, error})
  }
}

function* resetPassword() {
  const user = firebase.auth().currentUser
  if (user) {
    const email = user.email
    firebase.auth().sendPasswordResetEmail(email).then(function() {
    }, function(error) {
      // An error happened.
      alert(error)
    })
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_REQUEST, fbloginFlow)
  yield fork(watchEMLoginFlow)
  yield fork(watchEMCreateFlow)
  yield fork(takeLatest, RESET_PASSWORD, resetPassword)
  yield fork(takeLatest, LOGOUT_REQUEST, logoutFlow)
}