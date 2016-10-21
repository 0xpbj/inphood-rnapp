import {
  LOGIN_SUCCESS, REMOVE_CLIENT_PHOTO, IS_NEW_USER,
  LOAD_PHOTOS_SUCCESS, LOAD_PHOTOS_ERROR, INIT_CHAT_SAGA,
  INIT_MESSAGES, STORE_CHAT_SUCCESS, STORE_CHAT_ERROR,
  syncAddedGalleryChild, syncRemovedGalleryChild,
  SYNC_ADDED_GALLERY_CHILD, SYNC_REMOVED_GALLERY_CHILD,
  syncAddedMessagesChild, syncRemovedMessagesChild,
  SYNC_ADDED_MESSAGES_CHILD, SYNC_REMOVED_MESSAGES_CHILD,
  MARK_MESSAGE_READ, ADD_MESSAGES,
  INCREMENT_CLIENT_NOTIFICATION, INCREMENT_CLIENT_CHAT_NOTIFICATION,
  DECREMENT_TRAINER_NOTIFICATION, DECREMENT_TRAINER_CHAT_NOTIFICATION,
  DECREMENT_CLIENT_CHAT_NOTIFICATION, DECREMENT_CLIENT_NOTIFICATION, 
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest, takeEvery } from 'redux-saga'
import { Image } from "react-native"
import Config from '../constants/config-vars'
import * as db from './firebaseCommands'

import firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const turlHead = Config.AWS_CDN_THU_URL

function* updateDataVisibility() {
  while (true) {
    const data = yield take(REMOVE_CLIENT_PHOTO)
    firebase.database().ref(data.path).update({'visible': false})
  }
}

const prefetchData = (cdnPath) => {
  return Image.prefetch(cdnPath)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + cdnPath)})
}

const isLocalFile = (localFile) => {
  return RNFetchBlob.fs.exists(localFile)
    .then(flag => ({ flag }))
    .catch(error => ({ error }))
}

function* readFirebaseChatFlow() {
  while (true) {
    const data = yield take(MARK_MESSAGE_READ)
    const photo = data.photo
    const uid = data.uid
    const path = data.path
    const trainer = data.trainer
    if (trainer) {
      firebase.database().ref(data.path).update({'trainerRead': true})
      yield put({type: DECREMENT_TRAINER_NOTIFICATION, uid})
      yield put({type: DECREMENT_TRAINER_CHAT_NOTIFICATION, photo})
    }
    else {
      firebase.database().ref(data.path).update({'clientRead': true})
      yield put({type: DECREMENT_CLIENT_NOTIFICATION, uid})
      yield put({type: DECREMENT_CLIENT_CHAT_NOTIFICATION, photo})
    }
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
    const {chatMessages, databasePath} = yield select(state => state.chatReducer)
    const photo = databasePath.substring(databasePath.lastIndexOf('/')+1)
    const createdAt = Date.now()
    let clientRead = false
    let trainerRead = false
    if (trainer) {
      clientRead = true
      firebase.database().ref(databasePath).push({'notifyTrainer': true})
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
      firebase.database().ref(databasePath).push({'notifyClient': true})
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
    console.log(error)
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
    const path = '/global/' + uid + '/photoData/' + messages.photo
    const file = turlHead + uid + '/' + messages.photo + '.jpg'
    yield put ({type: ADD_MESSAGES, messages, path})
    if (messages.clientRead === false && id !== uid) {
      yield put({type: INCREMENT_CLIENT_NOTIFICATION})
      yield put({type: INCREMENT_CLIENT_CHAT_NOTIFICATION, photo: file, path})
    }
    const prevMessages = yield select(state => state.chatReducer.messages)
    const count = yield select(state => state.chatReducer.count)
  }
}

function* triggerRemMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_MESSAGES_CHILD)
    const child = data
  }
}

function* syncChatData() {
  while (true) {
    const data = yield take (INIT_MESSAGES)
    const msgPath = data.path + '/messages'
    yield fork(db.sync, msgPath, {
      child_added: syncAddedMessagesChild,
      child_removed: syncRemovedMessagesChild,
    })
  }
}

function* isNewUser() {
  let uid = yield select(state => state.authReducer.token)
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  const path = '/global/' + uid + '/photoData'
  const flag = (yield call(db.getPath, path)).exists()
  if (flag) {
    yield put({type: IS_NEW_USER, flag: false})
  }
  else {
    yield put({type: IS_NEW_USER, flag: true})
  }
}

function* triggerGetGalleryChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GALLERY_CHILD)
    if (data.val().visible) {
      const photo = data.val()
      yield put ({type: LOAD_PHOTOS_SUCCESS, photo})
      const messageData = photo.messages
      const path = photo.databasePath
      for (var keys in messageData) {
        const messages = messageData[keys]
        yield put ({type: ADD_MESSAGES, messages, path})
      }
      yield put ({type: INIT_MESSAGES, path})
    }
  }
}

function* triggerRemGalleryChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_GALLERY_CHILD)
    const child = data
  }
}

function* syncPhotoData() {
  let uid = yield select(state => state.authReducer.token)
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  const path = '/global/' + uid + '/photoData'
  yield fork(db.sync, path, {
    child_added: syncAddedGalleryChild,
    child_removed: syncRemovedGalleryChild,
  })
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, isNewUser)
  yield fork(takeEvery, INIT_CHAT_SAGA, sendChatData)
  yield fork(takeLatest, LOGIN_SUCCESS, syncChatData)
  yield fork(takeLatest, LOGIN_SUCCESS, syncPhotoData)
  yield fork(takeLatest, LOGIN_SUCCESS, readFirebaseChatFlow)
  yield fork(takeLatest, LOGIN_SUCCESS, updateDataVisibility)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerGetGalleryChild)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerRemGalleryChild)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerGetMessagesChild)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerRemMessagesChild)
}