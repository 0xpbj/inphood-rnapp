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
  SEND_AWS_INIT_CAMERA,
  SEND_AWS_INIT_LIBRARY,
  SEND_AWS_SUCCESS,
  SEND_AWS_ERROR,
  TAKE_PHOTO,
  SELECT_PHOTO,
  LOAD_PHOTOS_INIT,
  LOAD_CAMERAMEDIA_SUCCESS,
  LOAD_CAMERAMEDIA_ERROR
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

import { RNS3 } from 'react-native-aws3';
import CameraRoll from 'rn-camera-roll';

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;

const getRouteKey = state => state.routes.key

let options = {
  keyPrefix: "data/",
  bucket: 'inphoodimagescdn',
  region: 'us-west-2',
  accessKey: "AKIAI25XHNISG4KDDM3Q",
  secretKey: "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",
  successActionStatus: 201
}

const sendToAWS = (state, flag) => {
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
  if (flag) {
    caption = state.camReducer.caption
  }
  else {
    caption = state.libReducer.caption
  }
  key.set({
    file_name,
    caption,
    time
  });
  let image = ''
  if (flag) {
    image = state.camReducer.photo
  }
  else {
    image = state.libReducer.selected
  }
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

function* loadAWSCall(flag) {
  try {
    const state = yield select()
    yield call (sendToAWS, state, flag)
    yield put ({type: SEND_AWS_SUCCESS})
  }
  catch(error) {
    console.log(error)
    yield put ({type: SEND_AWS_ERROR, error})
  }
}

export function* watchAWSCameraCall() {
  while(true) {
    yield take(SEND_AWS_INIT_CAMERA)
    yield call(loadAWSCall, true)
  }
}

export function* watchAWSLibraryCall() {
  while(true) {
    yield take(SEND_AWS_INIT_LIBRARY)
    yield call(loadAWSCall, false)
  }
}

const cameraData = (cameraMedia) => {
  return CameraRoll.getPhotos({
    first: 15,
    assetType: 'Photos',
  }).then((data) => {
    return data.edges.forEach(d => cameraMedia.push({
      photo: d.node.image.uri,
    }));
  }).catch(error => console.log(error));
}

function* cameraDataFlow() {
  try {
    var cameraMedia = []
    yield call(cameraData, cameraMedia)
    yield put ({type: LOAD_CAMERAMEDIA_SUCCESS, cameraMedia})
  }
  catch(error) {
    yield put ({type: LOAD_CAMERAMEDIA_ERROR, error})
  }
}

const firebaseLogin = (photos) => {
  return AccessToken.getCurrentAccessToken().then(function (token) {
    let credential = firebase.auth.FacebookAuthProvider.credential(token)
    return firebase.auth().signInWithCredential(credential).then(function(user) {
      let turlHead = 'https://d2sb22kvjaot7x.cloudfront.net/resized-data/'
      let urlHead = 'https://dqh688v4tjben.cloudfront.net/data/'
      let imageRef = firebase.database().ref('/global/' + user.uid + '/userdata').orderByKey()
      return imageRef.once('value').then(function (snapshot) {
        return snapshot.forEach(function(childSnapshot) {
          let thumb = turlHead+childSnapshot.val().file_name
          let photo = urlHead+childSnapshot.val().file_name
          let caption = childSnapshot.val().caption
          let obj = {photo,caption,false}
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
    yield put ({type: LOGIN_SUCCESS})
  }
  catch(error) {
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
    yield put ({type: LOGOUT_ERROR, error})
  }
}

export function* watchLogoutFlow() {
  while (true) {
    yield take(LOGOUT_REQUEST)
    yield call(logoutFlow)
  }
}


export function* watchCameraData() {
  while (true) {
    yield take(LOAD_PHOTOS_INIT)
    yield call(cameraDataFlow)
  }
}

export const fetchFirebaseData = (photos) => {
  let user = firebase.auth().currentUser
  return firebase.database().ref('/global/' + user.uid + '/userdata').orderByKey().limitToLast(1).once('value')
  .then (function(snapshot){
    return snapshot.forEach(function(childSnapshot) {
      let turlHead = 'https://d2sb22kvjaot7x.cloudfront.net/resized-data/'
      let urlHead = 'https://dqh688v4tjben.cloudfront.net/data/'
      let thumb = turlHead+childSnapshot.val().file_name
      let photo = urlHead+childSnapshot.val().file_name
      let caption = childSnapshot.val().caption
      let obj = {photo,caption,false}
      photos.unshift(obj)
    })
  }, function(error) {
    console.log("Value Added Error", error);
  })
}

export function* firebaseData() {
  try {
    const state = yield select()
    var photos = state.galReducer.photos
    yield call(fetchFirebaseData, photos)
    yield put ({type: APPEND_PHOTOS_SUCCESS})
  }
  catch(error) {
    console.log('In firebasedata error')
    yield put ({type: APPEND_PHOTOS_FAILURE, error})
  }
}

export function* watchFirebaseDataFlow() {
  while (true) {
    yield take(SEND_AWS_SUCCESS)
    yield call(firebaseData)
  }
}
