import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR,
  STORE_UID, STORE_DEVICE_ID, LOGIN_IN_PROGRESS,
  BRANCH_REFERRAL_INFO, BRANCH_AUTH_SETUP, USER_SETTINGS,
  STORE_CDN_PICTURE, STORE_TRAINER_ID, STORE_REFERRAL_ID,
  SEND_FIREBASE_ERROR, STORE_SETTINGS_FORM, STORE_APP_VERSION,
  APP_UPDATED
} from '../constants/ActionTypes'

import {REHYDRATE} from 'redux-persist/constants'

import {race, call, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import { Image } from "react-native"
import Config from 'react-native-config'
import * as db from './firebaseCommands'
import firebase from 'firebase'
import branch from 'react-native-branch'
import DeviceInfo from 'react-native-device-info'

const defaultPicture = Config.AWS_CDN_THU_URL + 'default-profile.png'
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
      const {uid} = yield select(state => state.authReducer)
      if (!uid)
        throw 'User not authenticated'
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
  const picture = (yield select(state => state.infoReducer)).cdnProfilePicture
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
  firebase.database().ref('/global/deviceIdMap/' + uid + '/' + deviceId).set('user')
}

function* getUserInfo() {
  try {
    const {uid} = yield select(state => state.authReducer)
    if (uid) {
      const path = '/global/' + deviceId + '/userInfo/public'
      const data = (yield call(db.getPath, path)).val()
      branch.setIdentity(deviceId)
      if (data) {
        const birthday = data.birthday ? data.birthday : ''
        const email = data.email ? data.email : ''
        const diet = data.diet ? data.diet : ''
        const height = data.height ? data.height : ''
        const name = data.name ? data.name : ''
        let picture = data.picture ? data.picture : ''
        const values = name ? name.split(" ") : null
        const first_name = name ? values[0] : ''
        const last_name = name ? values[1] : ''
        const userSettings = {first_name, last_name, birthday, height, diet, email}
        yield put ({type: USER_SETTINGS, settings: userSettings})
        if (picture === '')
          picture = defaultPicture
        yield put ({type: STORE_CDN_PICTURE, picture})
        firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({
          name,
          picture,
          deviceId,
        })
      }
      else {
        yield put ({type: STORE_CDN_PICTURE, picture: defaultPicture})
        firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({
          name: '',
          picture: defaultPicture,
          deviceId
        })
      }
      const refPath = '/global/' + deviceId + '/referralInfo'
      const refData = (yield call(db.getPath, refPath)).val()
      if (refData) {
        const referralDeviceId = refData.referralDeviceId ? refData.referralDeviceId : ''
        const referralSetup = refData.referralSetup ? refData.referralSetup : ''
        const referralType = refData.referralType ? refData.referralType : ''
        const referralName = refData.referralName ? refData.referralName : ''
        yield put({type: BRANCH_REFERRAL_INFO, referralType, referralSetup, referralDeviceId, referralName})
        yield put({type: BRANCH_AUTH_SETUP, response: referralSetup})
      }
    }
    else
      throw 'User not authenticated'
  }
  catch(error) {
    yield put ({type: LOGIN_ERROR, error})
  }
}

function* loginFlow() {
  try {
    yield put ({type: LOGIN_IN_PROGRESS, flag: true})
    const {user, error} = yield call (firebaseLogin)
    if (user) {
      yield call (updateFirebaseMap, user.uid)
      const uid = user.uid
      yield put ({type: STORE_UID, uid})
      yield put ({type: STORE_DEVICE_ID, deviceId})
      firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({uid})
      yield call (getUserInfo)
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

function* watchAppUpdate() {
  const {appVersion} = yield select(state => state.authReducer)
  const devVersion = DeviceInfo.getVersion()
  if (appVersion !== '' && appVersion !== devVersion)
    yield put ({type: APP_UPDATED})
  yield put ({type: STORE_APP_VERSION, appVersion: devVersion})
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_REQUEST, loginFlow)
  yield fork(takeLatest, LOGOUT_REQUEST, logoutFlow)
  yield fork(takeLatest, [REHYDRATE], getUserInfo)
  yield fork(takeLatest, [REHYDRATE], watchAppUpdate)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], watchUserDataCall)
}