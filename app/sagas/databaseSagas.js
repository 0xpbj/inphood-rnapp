import {
  SEND_FIREBASE_CAMERA_SUCCESS,
  SEND_FIREBASE_LIBRARY_SUCCESS,
  APPEND_PHOTOS_SUCCESS,
  APPEND_PHOTOS_FAILURE,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import Config from 'react-native-config'

//let turlHead = Config.AWS_CDN_THU_URL
//let urlHead = Config.AWS_CDN_IMG_URL

let urlHead='http://dqh688v4tjben.cloudfront.net/data/'
let turlHead='http://d2sb22kvjaot7x.cloudfront.net/resized-data/'

export const fetchFirebaseData = (appendPhotos) => {
  let user = firebase.auth().currentUser
  return firebase.database().ref('/global/' + user.uid + '/userData').orderByKey().limitToLast(1).once('value')
  .then (function(snapshot){
    return snapshot.forEach(function(childSnapshot) {
      let thumb = turlHead+childSnapshot.child("immutable").val().fileName
      let photo = urlHead+childSnapshot.child("immutable").val().fileName
      let caption = childSnapshot.child("immutable").val().caption
      let title = childSnapshot.child("immutable").val().title
      let mealType = childSnapshot.child("immutable").val().mealType
      let time = childSnapshot.child("immutable").val().time
      let localFile = childSnapshot.child("immutable").val().localFile
      let obj = {photo,caption,mealType,time,title,localFile}
      appendPhotos.push(obj)
    })
  }, function(error) {
    console.log("Value Added Error", error);
  })
}

export function* firebaseData() {
  try {
    let appendPhotos = []
    yield call(fetchFirebaseData, appendPhotos)
    yield put ({type: APPEND_PHOTOS_SUCCESS, appendPhotos})
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
