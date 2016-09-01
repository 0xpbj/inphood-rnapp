import {
  LOGIN_SUCCESS,
  LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_ERROR,
  SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_LIBRARY_SUCCESS,
  APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_ERROR,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { Image } from "react-native"
import Config from 'react-native-config'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

// let urlHead='http://dqh688v4tjben.cloudfront.net/data/'
// let turlHead='http://d2sb22kvjaot7x.cloudfront.net/resized-data/'

const fetchFirebaseData = (imageRef, photos, user) => {
  return imageRef.once('value')
  .then(snapshot => {
    return snapshot.forEach(childSnapshot => {
      // let thumb = turlHead+childSnapshot.val().fileName
      const fileName = childSnapshot.val().fileName
      const photo = turlHead+fileName
      const caption = childSnapshot.val().caption
      const title = childSnapshot.val().title
      const mealType = childSnapshot.val().mealType
      const time = childSnapshot.val().time
      const localFile = childSnapshot.val().localFile
      var flag = false
      var prefetchTask = Image.prefetch(photo)
      prefetchTask.then(() => {
        flag = true
      })
      .catch(error => {console.log(error + ' - ' + photo)})
      const obj = {photo,caption,mealType,time,title,localFile,flag}
      photos.unshift(obj)
    })
  })
  .catch(error => {
    console.log("Value Added Error", error);
  })
}

function* firebaseData() {
  try {
    var appendPhotos = []
    const user = yield select(state => state.authReducer.user)
    const imageRef = firebase.database().ref('/global/' + user.uid + '/photoData').orderByKey().limitToLast(1)
    yield call(fetchFirebaseData, imageRef, appendPhotos, user)
    yield put ({type: APPEND_PHOTOS_SUCCESS, appendPhotos})
  }
  catch(error) {
    console.log(error)
    yield put ({type: APPEND_PHOTOS_ERROR, error})
  }
}

function* watchFirebaseDataFlow() {
  while (true) {
    yield take([SEND_FIREBASE_LIBRARY_SUCCESS, SEND_FIREBASE_CAMERA_SUCCESS])
    yield call(firebaseData)
  }
}

function* loadInitialData() {
  try {
    var photos = []
    const user = yield select(state => state.authReducer.user)
    const imageRef = firebase.database().ref('/global/' + user.uid + '/photoData').orderByKey()
    yield call(fetchFirebaseData, imageRef, photos, user)
    yield put ({type: LOAD_PHOTOS_SUCCESS, photos})
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOAD_PHOTOS_ERROR, error})
  }
}

function* initialFirebaseData() {
  while (true) {
    yield take(LOGIN_SUCCESS)
    yield call(loadInitialData)
  }
}

export default function* rootSaga() {
  yield fork(initialFirebaseData)
  yield fork(watchFirebaseDataFlow)
}