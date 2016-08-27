import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK

const firebaseLogin = () => {
  return AccessToken.getCurrentAccessToken()
  .then(token => {
    let credential = firebase.auth.FacebookAuthProvider.credential(token)
    return firebase.auth().signInWithCredential(credential)
    .then(user => ({ user }))
    .catch(error => ({ error }))
  })
}

function* loginFlow() {
  try {
    const {user, error} = yield call(firebaseLogin)
    yield put ({type: LOGIN_SUCCESS, user})
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOGIN_ERROR, error})
  }
}

function* watchLoginFlow() {
  while (true) {
    yield take(LOGIN_REQUEST)
    yield call(loginFlow)
  }
}

const firebaseLogout = () => {
  return firebase.auth().signOut()
  .then(() => {
    alert('Logged out.');
  }, (error) => {
  });
}

function* logoutFlow() {
  try {
    yield call(firebaseLogout)
    yield put ({type: LOGOUT_SUCCESS})
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOGOUT_ERROR, error})
  }
}

function* watchLogoutFlow() {
  while (true) {
    yield take(LOGOUT_REQUEST)
    yield call(logoutFlow)
  }
}

export default function* rootSaga() {
  yield fork(watchLoginFlow)
  yield fork(watchLogoutFlow)
}