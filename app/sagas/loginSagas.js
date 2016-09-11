import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR,
  STORE_RESULT, STORE_TOKEN,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

const FBSDK = require('react-native-fbsdk')
const {
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
  AccessToken,
  Profile,
} = FBSDK

const facebookGraphCallback = (error: ?Object, result: ?Object) => {
  if (error) {
    alert('Error fetching data: ' + error.toString())
  }
  else {
    if (result) {
      // console.log(result)
    }
    else {
      alert ('Please login.')
    }
  }
}

const facebookGraph = () => {
  const infoRequest = new GraphRequest(
    '/me?fields=id,email,gender,birthday,first_name,last_name,name,picture.type(normal)',
    null,
    facebookGraphCallback
  )
  const graphManager = new GraphRequestManager()
  graphManager.addRequest(infoRequest).start()
}

const facebookLogin = () => {
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
    const {user, error} = yield call(facebookLogin)
    // yield cps(facebookGraph)
    const id = user.providerData[0].uid
    const name = user.providerData[0].displayName
    const picture = user.providerData[0].photoURL
    const provider = user.providerData[0].providerId
    const values = name.split(" ")
    const first_name = values[0]
    const last_name = values[1]
    const result = {id, name, picture, first_name, last_name, provider}
    const token = user.uid
    yield put ({type: STORE_RESULT, result})
    yield put ({type: STORE_TOKEN, token})
    yield put ({type: LOGIN_SUCCESS, user})
  }
  catch(error) {
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