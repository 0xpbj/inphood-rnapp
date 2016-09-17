import {
  LOGIN_SUCCESS, ADD_MESSAGES, REFRESH_CLIENT_DATA, REMOVE_CLIENT_PHOTO,
  LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_ERROR, INIT_MESSAGES,
  SEND_FIREBASE_CAMERA_SUCCESS, SEND_FIREBASE_LIBRARY_SUCCESS,
  APPEND_PHOTOS_SUCCESS, APPEND_PHOTOS_ERROR,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { Image } from "react-native"
import Config from 'react-native-config'

import firebase from 'firebase'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

const fetchFirebaseData = (imageRef, photos, user) => {
  return imageRef.once('value')
  .then(snapshot => {
    return snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val()
      const visible = data.visible
      if (visible) {
        // let thumb = turlHead+data.fileName
        const fileName = data.fileName
        const photo = turlHead+fileName
        const caption = data.caption
        const title = data.title
        const mealType = data.mealType
        const time = data.time
        const localFile = data.localFile
        const notification = data.notifyClient
        var flag = false
        var prefetchTask = Image.prefetch(photo)
        prefetchTask.then(() => {
          flag = true
        })
        .catch(error => {console.log(error + ' - ' + photo)})
        const obj = {photo,caption,mealType,time,title,localFile,flag,data,notification}
        photos.unshift(obj)
      }
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

function* updateDataVisibility() {
  while (true) {
    const data = yield take(REMOVE_CLIENT_PHOTO)
    firebase.database().ref(data.path).update({'visible': false})
    yield put({type: REFRESH_CLIENT_DATA})
  }
}

function* dataInit() {
  while (true) {
    yield take([INIT_MESSAGES, REFRESH_CLIENT_DATA])
    yield call(loadInitialData)
  }
}

export default function* rootSaga() {
  yield take(LOGIN_SUCCESS)
  yield fork(dataInit)
  yield fork(watchFirebaseDataFlow)
  yield fork(updateDataVisibility)
}
