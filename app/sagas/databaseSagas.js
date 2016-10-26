import {
  LOGIN_SUCCESS, REMOVE_CLIENT_PHOTO, IS_NEW_USER,
  LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_ERROR,
  INIT_MESSAGES, STORE_CHAT_SUCCESS, STORE_CHAT_ERROR,
  syncAddedGalleryChild, syncRemovedGalleryChild,
  SYNC_ADDED_GALLERY_CHILD, SYNC_REMOVED_GALLERY_CHILD,
  syncAddedMessagesChild, SYNC_ADDED_MESSAGES_CHILD,
  ADD_MESSAGES, INIT_CHAT_SAGA, MARK_PHOTO_READ,
  INCREMENT_CLIENT_PHOTO_NOTIFICATION, DECREMENT_CLIENT_PHOTO_NOTIFICATION, 
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest, takeEvery } from 'redux-saga'
import { Image } from "react-native"
import Config from '../constants/config-vars'
import * as db from './firebaseCommands'

import firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const turlHead = Config.AWS_CDN_THU_URL

const isLocalFile = (localFile) => {
  return RNFetchBlob.fs.exists(localFile)
    .then(flag => ({ flag }))
    .catch(error => ({ error }))
}

const prefetchData = (cdnPath) => {
  return Image.prefetch(cdnPath)
    .then(() => {console.log('Data prefetch: ', cdnPath)})
    .catch(error => {console.log(error + ' - ' + cdnPath)})
}

function* startDataPrefetch() {
  const {cdnPaths} = yield select(state => state.galReducer)
  for (let path in cdnPaths) {
    yield fork(prefetchData, cdnPaths[path])
  }
}

function* readPhotoFlow() {
  while (true) {
    const data = yield take(MARK_PHOTO_READ)
    const {path, photo} = data
    firebase.database().ref(path).update({'notifyClient': false})
    yield put({type: DECREMENT_CLIENT_PHOTO_NOTIFICATION, databasePath: path})
  }
}

function* sendChatData() {
  try {
    let uid = yield select(state => state.authReducer.token)
    if (!uid) {
      uid = firebase.auth().currentUser.uid
    }
    const trainer = (yield select(state => state.authReducer.result)).trainerId
    const client = yield select(state => state.chatReducer.client)
    const {chatMessages, databasePath, cdnPath} = yield select(state => state.chatReducer)
    const photo = databasePath.substring(databasePath.lastIndexOf('/')+1)
    const createdAt = Date.now()
    let clientRead = false
    let trainerRead = false
    if (trainer) {
      clientRead = true
      firebase.database().ref(databasePath).update({'notifyTrainer': true})
      firebase.database().ref(databasePath + '/messages').push({
        uid,
        trainer,
        photo,
        createdAt,
        clientRead,
        trainerRead,
        "message": chatMessages[0]
      })
    }
    else {
      trainerRead = true
      firebase.database().ref(databasePath).update({'notifyClient': true})
      firebase.database().ref(databasePath + '/messages').push({
        uid: client,
        trainer: uid,
        photo,
        createdAt,
        clientRead,
        trainerRead,
        "message": chatMessages[0]
      })
    }
    yield put ({type: STORE_CHAT_SUCCESS})
  }
  catch(error) {
    yield put ({type: STORE_CHAT_ERROR, error})
  }
}

function* triggerGetMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CHILD)
    const messages = data.val()
    let id = yield select(state => state.authReducer.token)
    if (!id) {
      id = firebase.auth().currentUser.uid
    }
    const uid  = messages.uid
    const trainer = messages.trainer
    const flag = messages.trainerRead
    const path = '/global/' + uid + '/photoData/' + messages.photo
    const file = turlHead + uid + '/' + messages.photo + '.jpg'
    yield put ({type: ADD_MESSAGES, messages, path})
    if (flag)
      yield put({type: INCREMENT_CLIENT_PHOTO_NOTIFICATION, databasePath: path})
    const prevMessages = yield select(state => state.chatReducer.messages)
    const count = yield select(state => state.chatReducer.count)
  }
}

function* syncChatData() {
  while (true) {
    const data = yield take (INIT_MESSAGES)
    const msgPath = data.path + '/messages'
    yield fork(db.sync, msgPath, {
      child_added: syncAddedMessagesChild,
    })
  }
}

function* isNewUser() {
  let uid = yield select(state => state.authReducer.token)
  if (uid === '' && firebase.auth().currentUser) {
    uid = firebase.auth().currentUser.uid
  }
  if (uid !== '') {
    const path = '/global/' + uid + '/photoData'
    const flag = (yield call(db.getPath, path)).exists()
    if (flag) {
      yield put({type: IS_NEW_USER, flag: false})
    }
    else {
      yield put({type: IS_NEW_USER, flag: true})
    }
  }
}

function* triggerGetGalleryChild() {
  const {databasePaths} = yield select(state => state.galReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GALLERY_CHILD)
    const photo = data.val()
    const cdnPath = turlHead+photo.fileName
    const time = photo.time
    const databasePath = photo.databasePath
    if (databasePaths.includes(databasePath) === false)
      yield put ({type: LOAD_PHOTOS_SUCCESS, photo})
    if (photo.notifyClient) {
      yield put({type: INCREMENT_CLIENT_PHOTO_NOTIFICATION, databasePath})
    }
    const messageData = photo.messages
    const path = photo.databasePath
    for (var keys in messageData) {
      const messages = messageData[keys]
      yield put ({type: ADD_MESSAGES, messages, path})
    }
    yield put ({type: INIT_MESSAGES, path})
  }
}

function* updateDataVisibility() {
  while (true) {
    const data = yield take(REMOVE_CLIENT_PHOTO)
    firebase.database().ref(data.path).remove()
  }
}

function* triggerRemGalleryChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_GALLERY_CHILD)
    firebase.database().ref('global/anonymous/photoData/').push(data.val())
  }
}

function* syncPhotoData() {
  let uid = yield select(state => state.authReducer.token)
  if (uid === '' && firebase.auth().currentUser) {
    uid = firebase.auth().currentUser.uid
  }
  if (uid !== '') {
    const path = '/global/' + uid + '/photoData'
    yield fork(db.sync, path, {
      child_added: syncAddedGalleryChild,
      child_removed: syncRemovedGalleryChild,
    })
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], isNewUser)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], syncChatData)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], syncPhotoData)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], readPhotoFlow)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], startDataPrefetch)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], updateDataVisibility)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetGalleryChild)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerRemGalleryChild)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetMessagesChild)
  yield fork(takeEvery, INIT_CHAT_SAGA, sendChatData)
}