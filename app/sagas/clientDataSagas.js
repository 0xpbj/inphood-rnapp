import {
  ADD_PHOTOS, ADD_INFOS, ADD_MESSAGES, ADD_CLIENTS, INIT_DATA,
  syncCountPhotoChild, syncAddedPhotoChild, syncRemovedPhotoChild,
  SYNC_COUNT_PHOTO_CHILD, SYNC_ADDED_PHOTO_CHILD, SYNC_REMOVED_PHOTO_CHILD,
  syncAddedMessagesClientChild, syncRemovedMessagesClientChild,
  SYNC_ADDED_MESSAGES_CLIENT_CHILD, SYNC_REMOVED_MESSAGES_CLIENT_CHILD,
  INIT_CLIENT_MESSAGES, syncAddedInfoChild, syncRemovedInfoChild,
  SYNC_ADDED_INFO_CHILD, SYNC_REMOVED_INFO_CHILD, MARK_CLIENT_PHOTO_READ,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION, DECREMENT_TRAINER_PHOTO_NOTIFICATION,
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import * as db from './firebaseCommands'
import { Image } from "react-native"
import {call, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import Config from '../constants/config-vars'

import firebase from 'firebase'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

const prefetchData = (cdnPath) => {
  return Image.prefetch(cdnPath)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + cdnPath)})
}

function* readClientPhotoFlow() {
  while (true) {
    const data = yield take(MARK_CLIENT_PHOTO_READ)
    const {path, uid} = data
    firebase.database().ref(path).update({'notifyTrainer': false})
    yield put({type: DECREMENT_TRAINER_PHOTO_NOTIFICATION, databasePath: path, client: uid})
  }
}

function* triggerGetMessagesClientChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CLIENT_CHILD)
    const messages = data.val()
    let id = yield select(state => state.authReducer.token)
    if (!id) {
      id = firebase.auth().currentUser.uid
    }
    const uid  = messages.uid
    const trainer = messages.trainer
    const flag = messages.clientRead
    const path = '/global/' + uid + '/photoData/' + messages.photo
    const file = turlHead + uid + '/' + messages.photo + '.jpg'
    yield put ({type: ADD_MESSAGES, messages, path})
    if (flag)
      yield put({type: INCREMENT_TRAINER_PHOTO_NOTIFICATION, databasePath: path, client: uid})
    const prevMessages = yield select(state => state.chatReducer.messages)
    const count = yield select(state => state.chatReducer.count)
  }
}

function* triggerRemMessagesClientChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_MESSAGES_CLIENT_CHILD)
    const child = data
  }
}

function* syncClientChatData() {
  while (true) {
    const data = yield take (INIT_CLIENT_MESSAGES)
    const msgPath = data.path + '/messages'
    yield fork(db.sync, msgPath, {
      child_added: syncAddedMessagesClientChild,
      child_removed: syncRemovedMessagesClientChild,
    })
  }
}

function* triggerGetPhotoChild() {
  const {databasePaths} = yield select(state => state.trainerReducer)
  console.log(databasePaths)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_PHOTO_CHILD)
    if (data.val().visible) {
      const file = data.val()
      const uid = file.uid
      const cdnPath = turlHead+file.fileName
      const databasePath = file.databasePath
      const time = file.time
      if ((Date.now() - time) > 60000) {
        yield fork(prefetchData, cdnPath)
      }
      var child = {}
      child[uid] = file
      if (file.notifyTrainer) {
        yield put({type: INCREMENT_TRAINER_PHOTO_NOTIFICATION, databasePath, client: uid})
      }
      if (databasePaths.includes(databasePath) === false)
        yield put({type: ADD_PHOTOS, child, databasePath})
      const messageData = file.messages
      const path = file.databasePath
      for (var keys in messageData) {
        const messages = messageData[keys]
        yield put ({type: ADD_MESSAGES, messages, path})
      }
      yield put ({type: INIT_CLIENT_MESSAGES, path})
    }
  }
}

function* triggerRemPhotoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_PHOTO_CHILD)
    const child = data
  }
}

function* triggerGetInfoChild() {
  const {infoIds} = yield select(state => state.trainerReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_INFO_CHILD)
    const name = data.val().name
    const picture = data.val().picture
    const child = {name, picture}
    const id = data.ref.parent.path.o[1]
    const info = {id, child}
    if (infoIds.includes(id) === false)
      yield put({type: ADD_INFOS, child: info})
  }
}

function* triggerRemInfoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_INFO_CHILD)
    const child = data
  }
}

function* syncData() {
  let clients = yield select(state => state.trainerReducer.clients)
  for (let i = 0; i < clients.length; i++) {
    let path = '/global/' + clients[i]
    yield fork(db.sync, path, {
      child_added: syncCountPhotoChild,
    })
    yield fork(db.sync, path + '/photoData', {
      child_added: syncAddedPhotoChild,
      child_removed: syncRemovedPhotoChild,
    })
    yield fork(db.sync, path + '/userInfo', {
      child_added: syncAddedInfoChild,
      child_removed: syncRemovedInfoChild,
    })
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], syncData)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], syncClientChatData)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], readClientPhotoFlow)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerGetInfoChild)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerRemInfoChild)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerGetPhotoChild)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerRemPhotoChild)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerGetMessagesClientChild)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerRemMessagesClientChild)
}