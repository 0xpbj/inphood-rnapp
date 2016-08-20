import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOAD_PHOTOS_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
  STORE_TRAINER,
  INIT_CLIENTS_DATA
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import Config from 'react-native-config'
import { Image } from "react-native"

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;

//let turlHead = Config.AWS_CDN_THU_URL
//let urlHead = Config.AWS_CDN_IMG_URL

let urlHead='http://dqh688v4tjben.cloudfront.net/data/'
let turlHead='http://d2sb22kvjaot7x.cloudfront.net/resized-data/'

const firebaseTrainer = () => {
  let user = firebase.auth().currentUser
  let clientRef = firebase.database().ref('/global/' + user.uid + '/trainerInfo/clientId/')
  return clientRef.once('value').then(function (snapshot) {
    return snapshot.hasChildren()
  })
}

const firebaseLogin = (photos) => {
  return AccessToken.getCurrentAccessToken().then(function (token) {
    let credential = firebase.auth.FacebookAuthProvider.credential(token)
    return firebase.auth().signInWithCredential(credential).then(function(user) {
      let imageRef = firebase.database().ref('/global/' + user.uid + '/userData').orderByKey()
      return imageRef.once('value').then(function (snapshot) {
        return snapshot.forEach(function(childSnapshot) {
          let thumb = turlHead+childSnapshot.child("immutable").val().fileName
          let photo = urlHead+childSnapshot.child("immutable").val().fileName
          let caption = childSnapshot.child("immutable").val().caption
          let title = childSnapshot.child("immutable").val().title
          let mealType = childSnapshot.child("immutable").val().mealType
          let time = childSnapshot.child("immutable").val().time
          let localFile = childSnapshot.child("immutable").val().localFile
          var prefetchTask = Image.prefetch(photo)
          prefetchTask.then(() => {
          }, error => {
          })
          let obj = {photo,caption,mealType,time,title,localFile}
          photos.unshift(obj)
        })
      })
      }, function(error) {
        console.log("Sign In Error", error);
      });
    }
  )
}

function* loginFlow() {
  try {
    var photos = []
    yield call(firebaseLogin, photos)
    yield put ({type: LOAD_PHOTOS_SUCCESS, photos})
    var flag = yield call(firebaseTrainer)
    yield put ({type: STORE_TRAINER, flag})
    yield put ({type: LOGIN_SUCCESS})
    if (flag) {
      yield put({type: INIT_CLIENTS_DATA})
    }
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOGIN_ERROR, error})
  }
}

export function* watchLoginFlow() {
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

export function* watchLogoutFlow() {
  while (true) {
    yield take(LOGOUT_REQUEST)
    yield call(logoutFlow)
  }
}
