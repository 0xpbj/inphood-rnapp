import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOAD_PHOTOS_SUCCESS,
  APPEND_PHOTOS_SUCCESS,
  APPEND_PHOTOS_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
  SEND_FIREBASE_LIBRARY_SUCCESS,
  SEND_FIREBASE_CAMERA_SUCCESS,
  SEND_FIREBASE_ERROR,
  SEND_FIREBASE_INIT_CAMERA,
  SEND_FIREBASE_INIT_LIBRARY,
  SEND_AWS_SUCCESS,
  SEND_AWS_ERROR,
  TAKE_PHOTO,
  SELECT_PHOTO,
  STORE_USER_MESSAGES,
  STORE_TRAINER_MESSAGES,
  STORE_IMAGE_DATA,
  LOAD_PHOTOS_INIT,
  LOAD_CAMERAMEDIA_SUCCESS,
  APPEND_CAMERAMEDIA_SUCCESS,
  LOAD_CAMERAMEDIA_ERROR
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

import { RNS3 } from 'react-native-aws3'
import { CameraRoll, Image } from "react-native"
import Config from 'react-native-config'

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;

let options = {
  keyPrefix: "data/",
  bucket: 'inphoodimagescdn',
  region: 'us-west-2',
  accessKey: "AKIAI25XHNISG4KDDM3Q",
  secretKey: "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",
  successActionStatus: 201
}
let turlHead = 'http://d2sb22kvjaot7x.cloudfront.net/resized-data/'
let urlHead = 'http://dqh688v4tjben.cloudfront.net/data/'

const sendToAWS = (image, file_name) => {
  let imgfile = {
    uri : image,
    type: 'image/jpeg',
    name: file_name,
  }
  return RNS3.put(imgfile, options)
  .then(response => {
    if (response.status !== 201)
      throw new Error("Failed to upload image to S3");
  })
  .catch(err => console.log('Errors uploading: ' + err));
}

function* loadAWSCall(flag, file_name) {
  try {
    const state = yield select()
    let image = ''
    if (flag) {
      image = state.camReducer.photo
    }
    else {
      image = state.libReducer.selected
    }
    yield call (sendToAWS, image, file_name)
    yield put ({type: SEND_AWS_SUCCESS})
  }
  catch(error) {
    yield put ({type: SEND_AWS_ERROR, error})
  }
}

const sendToFirebase = (state, flag) => {
  let result = state.authReducer.result
  let uid = firebase.auth().currentUser.uid
  let name = result.name
  let gender = result.gender
  let id = result.id
  let picture = result.picture.data.url
  let time = Date.now()
  firebase.database().ref('/global/' + uid + '/userinfo').set({
    name,
    gender,
    id,
    picture,
  })
  let key = firebase.database().ref('/global/' + uid + '/userdata').push()
  let file_name = uid + '/' + key.path.o[3] + '.jpg';
  let caption = ''
  let mealType = ''
  let messages = []
  let title = ''
  let localFile = ''
  if (flag) {
    caption = state.camReducer.caption
    title = state.camReducer.title
    mealType = state.camReducer.mealType
    localFile = state.camReducer.photo
  }
  else {
    caption = state.libReducer.caption
    title = state.libReducer.title
    mealType = state.libReducer.mealType
    localFile = state.libReducer.selected
  }
  messages = state.chatReducer.messages
  key.set({
    file_name,
    title,
    caption,
    mealType,
    localFile,
    time
  });
  return file_name
}

function* loadFirebaseCall(flag) {
  try {
    const state = yield select()
    let file_name = yield call (sendToFirebase, state, flag)
    if (flag) {
      yield put ({type: SEND_FIREBASE_CAMERA_SUCCESS})
      yield call(loadAWSCall, true, file_name)
    }
    else {
      yield put ({type: SEND_FIREBASE_LIBRARY_SUCCESS})
      yield call(loadAWSCall, false, file_name)
    }
  }
  catch(error) {
    console.log(error)
    yield put ({type: SEND_FIREBASE_ERROR, error})
  }
}

export function* watchFirebaseCameraCall() {
  while(true) {
    yield take(SEND_FIREBASE_INIT_CAMERA)
    yield call(loadFirebaseCall, true)
  }
}

export function* watchFirebaseLibraryCall() {
  while(true) {
    yield take(SEND_FIREBASE_INIT_LIBRARY)
    yield call(loadFirebaseCall, false)
  }
}

const firebaseLogin = (photos) => {
  return AccessToken.getCurrentAccessToken().then(function (token) {
    let credential = firebase.auth.FacebookAuthProvider.credential(token)
    return firebase.auth().signInWithCredential(credential).then(function(user) {
      let imageRef = firebase.database().ref('/global/' + user.uid + '/userdata').orderByKey()
      return imageRef.once('value').then(function (snapshot) {
        return snapshot.forEach(function(childSnapshot) {
          let thumb = turlHead+childSnapshot.val().file_name
          let photo = urlHead+childSnapshot.val().file_name
          let caption = childSnapshot.val().caption
          let title = childSnapshot.val().title
          let mealType = childSnapshot.val().mealType
          let time = childSnapshot.val().time
          let localFile = childSnapshot.val().localFile
          var prefetchTask = Image.prefetch(photo)
          prefetchTask.then(() => {
            let prefetch = true
            let obj = {photo,caption,mealType,time,title,localFile,prefetch}
            photos.unshift(obj)
          }, error => {
            let prefetch = false
            let obj = {photo,caption,mealType,time,title,localFile,prefetch}
            photos.unshift(obj)
          })
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
    yield put ({type: LOGIN_SUCCESS})
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

export const fetchFirebaseData = (appendPhotos, messages, trainerMessages) => {
  let user = firebase.auth().currentUser
  return firebase.database().ref('/global/' + user.uid + '/userdata').orderByKey().limitToLast(1).once('value')
  .then (function(snapshot){
    return snapshot.forEach(function(childSnapshot) {
      let thumb = turlHead+childSnapshot.val().file_name
      let photo = urlHead+childSnapshot.val().file_name
      let caption = childSnapshot.val().caption
      let title = childSnapshot.val().title
      let mealType = childSnapshot.val().mealType
      let time = childSnapshot.val().time
      let localFile = childSnapshot.val().localFile
      let obj = {photo,caption,mealType,time,title,localFile}
      appendPhotos.push(obj)
      messages.push(childSnapshot.val().messages)
      trainerMessages.push(childSnapshot.val().trainerMessages)
    })
  }, function(error) {
    console.log("Value Added Error", error);
  })
}

export function* firebaseData() {
  try {
    let appendPhotos = []
    let messages = []
    let trainerMessages = []
    yield call(fetchFirebaseData, appendPhotos, messages, trainerMessages)
    yield put ({type: APPEND_PHOTOS_SUCCESS, appendPhotos})
    yield put ({type: STORE_USER_MESSAGES, messages})
    yield put ({type: STORE_TRAINER_MESSAGES, trainerMessages})
  }
  catch(error) {
    console.log(error)
    yield put ({type: APPEND_PHOTOS_FAILURE, error})
  }
}

export function* watchFirebaseDataFlow() {
  while (true) {
    yield take([SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS])
    yield call(firebaseData)
  }
}
