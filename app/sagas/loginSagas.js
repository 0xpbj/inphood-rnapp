import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR,
  STORE_UID, STORE_DEVICE_ID, LOGIN_IN_PROGRESS,
  BRANCH_REFERRAL_INFO, BRANCH_AUTH_TRAINER, USER_SETTINGS,
  STORE_CDN_PICTURE, STORE_TRAINER_ID,
  SEND_FIREBASE_ERROR, STORE_SETTINGS_FORM,
} from '../constants/ActionTypes'

import {REHYDRATE} from 'redux-persist/constants'

import {race, call, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import { Image } from "react-native"
import Config from '../constants/config-vars'
import * as db from './firebaseCommands'
import firebase from 'firebase'
import branch from 'react-native-branch'
import DeviceInfo from 'react-native-device-info'

const defaultPicture = Config.AWS_CDN_IMG_URL + 'banana.jpg'
const deviceId = DeviceInfo.getUniqueID()

const sendUserDataToFirebase = (form, uid) => {
  if (uid) {
    let {first_name, last_name, birthday, height, diet, email} = form
    let name = first_name ? first_name : ''
    name = name + ' ' + (last_name ? last_name : '')
    height = height ? height : ''
    email = email ? email : ''
    birthday = birthday ? birthday : ''
    firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({
      name,
      birthday,
      height,
      diet,
      email,
    })
  }
  else
    throw 'User not authenticated'
}

function* watchUserDataCall() {
  while (true) {
    try {
      const data = yield take(STORE_SETTINGS_FORM)
      let {uid} = yield select(state => state.authReducer)
      if (!uid)
        uid = firebase.auth().currentUser.uid
      yield call(sendUserDataToFirebase, data.form, uid)
      let {first_name, last_name, birthday, height, diet, email} = data.form
      first_name = first_name ? first_name : ''
      last_name = last_name ? last_name : ''
      const userSettings = {first_name, last_name, birthday, height, diet, email}
      yield put ({type: USER_SETTINGS, settings: userSettings})
    }
    catch(error) {
      yield put ({type: SEND_FIREBASE_ERROR, error})
    }
  }
}

function* userDataPrefetch() {
  const picture = (yield select(state => state.authReducer)).cdnProfilePicture
  Image.prefetch(picture)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + cdnPath)})
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
      branch.logout()
      yield put ({type: LOGOUT_SUCCESS})
    }
  }
  catch(error) {
    yield put ({type: LOGOUT_ERROR, error})
  }
}

const firebaseLogin = () => {
  return firebase.auth().signInAnonymously()
  .then(user => ({ user }))
  .catch(error => ({ error }))
}

const updateFirebaseMap = (uid) => {
  firebase.database().ref('/global/deviceIdMap/' + uid + '/' + deviceId).set('User')
}

function* loginFlow() {
  try {
    yield put ({type: LOGIN_IN_PROGRESS, flag: true})
    const {user, error} = yield call (firebaseLogin)
    if (user) {
      yield call (updateFirebaseMap, user.uid)
      const uid = user.uid
      branch.setIdentity(deviceId)
      const path = '/global/' + deviceId + '/userInfo/public'
      const data = null
      yield put ({type: STORE_UID, uid})
      yield put ({type: STORE_DEVICE_ID, deviceId})
      console.log("Data: ", data)
      if (data) {
        const trainerId = data.trainerId ? data.trainerId : ''
        const birthday = data.birthday ? data.birthday : ''
        const email = data.email ? data.email : ''
        const diet = data.diet ? data.diet : ''
        const height = data.height ? data.height : ''
        const name = data.name ? data.name : ''
        const picture = data.picture ? data.picture : ''
        const referralSetup = data.referralSetup ? data.referralSetup : ''
        const referralType = data.referralType ? data.referralType : ''
        const referralId = data.referralId ? data.referralId : ''
        const authTrainer = data.authTrainer ? data.authTrainer : ''
        const trainerName = data.trainerName ? data.trainerName : ''
        yield put({type: BRANCH_REFERRAL_INFO, referralType, referralSetup, referralId, trainerName})
        yield put({type: BRANCH_AUTH_TRAINER, response: authTrainer})
        const values = name ? name.split(" ") : null
        const first_name = name ? values[0] : ''
        const last_name = name ? values[1] : ''
        const userSettings = {first_name, last_name, birthday, height, diet, email}
        yield put ({type: USER_SETTINGS, settings: userSettings})
        if (picture)
          yield put ({type: STORE_CDN_PICTURE, picture})
        if (trainerId)
          yield put ({type: STORE_TRAINER_ID, trainerId})
        firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({
          uid,
          name,
          picture,
          deviceId
        })
      }
      yield put ({type: LOGIN_IN_PROGRESS, flag: false})
      yield put ({type: LOGIN_SUCCESS})
    }
    else
      yield put ({type: LOGIN_IN_PROGRESS, flag: false})
  }
  catch(error) {
    yield put ({type: LOGIN_IN_PROGRESS, flag: false})
    yield put ({type: LOGIN_ERROR, error})
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, STORE_CDN_PICTURE, userDataPrefetch)
  yield fork(takeLatest, LOGOUT_REQUEST, logoutFlow)
  yield fork(takeLatest, LOGIN_REQUEST, loginFlow)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], watchUserDataCall)
}
