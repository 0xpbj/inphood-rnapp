import {
  ADD_PHOTOS, ADD_INFOS, ADD_MESSAGES, ADD_CLIENTS, INIT_DATA, REMOVE_PHOTO,
  syncAddedPhotoChild, syncRemovedPhotoChild,
  SYNC_ADDED_PHOTO_CHILD, SYNC_REMOVED_PHOTO_CHILD,
  syncAddedMessagesClientChild, SYNC_ADDED_MESSAGES_CLIENT_CHILD, 
  INIT_CLIENT_MESSAGES, syncAddedInfoChild, syncRemovedInfoChild,
  SYNC_ADDED_INFO_CHILD, SYNC_REMOVED_INFO_CHILD, MARK_CLIENT_PHOTO_READ,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION, DECREMENT_TRAINER_PHOTO_NOTIFICATION,
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import * as db from './firebaseCommands'
import { Image } from "react-native"
import {call, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import Config from 'react-native-config'

import firebase from 'firebase'

import DeviceInfo from 'react-native-device-info'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL
const deviceId = DeviceInfo.getUniqueID()

const prefetchData = (cdnPath) => {
  return Image.prefetch(cdnPath)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + cdnPath)})
}

function* startClientDataPrefetch() {
  const {cdnPaths} = yield select(state => state.trainerReducer)
  for (let path in cdnPaths) {
    yield fork(prefetchData, cdnPaths[path])
  }
}

function* readClientPhotoFlow() {
  while (true) {
    const data = yield take(MARK_CLIENT_PHOTO_READ)
    const {path, rDeviceId} = data
    firebase.database().ref(path).update({'notifyTrainer': false})
    yield put({type: DECREMENT_TRAINER_PHOTO_NOTIFICATION, databasePath: path, client: rDeviceId})
  }
}

function* triggerGetMessagesClientChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CLIENT_CHILD)
    const messages = data.val()
    const mDeviceId  = messages.messageDeviceId
    const trainer = messages.trainer
    const flag = messages.clientRead
    const path = '/global/' + mDeviceId + '/photoData/' + messages.photo
    const file = turlHead + mDeviceId + '/' + messages.photo + '.jpg'
    yield put ({type: ADD_MESSAGES, messages, path})
    if (flag)
      yield put({type: INCREMENT_TRAINER_PHOTO_NOTIFICATION, databasePath: path, client: mDeviceId})
    const prevMessages = yield select(state => state.chatReducer.messages)
    const count = yield select(state => state.chatReducer.count)
  }
}

function* syncClientChatData() {
  while (true) {
    const data = yield take (INIT_CLIENT_MESSAGES)
    const msgPath = data.path + '/messages'
    yield fork(db.sync, msgPath, {
      child_added: syncAddedMessagesClientChild
    })
  }
}

function* triggerGetPhotoChild() {
  const {databasePaths} = yield select(state => state.trainerReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_PHOTO_CHILD)
    if (data.val().visible) {
      const file = data.val()
      const fDeviceId = file.deviceId
      const cdnPath = turlHead+file.fileName
      const databasePath = file.databasePath
      const time = file.time
      // const delay = Date.now()
      // while (time < delay + 5000) {
      //   console.log('waiting...')
      // }
      var child = {}
      child[fDeviceId] = file
      if (file.notifyTrainer) {
        yield put({type: INCREMENT_TRAINER_PHOTO_NOTIFICATION, databasePath, client: fDeviceId})
      }
      if (databasePaths.includes(databasePath) === false)
        yield put({type: ADD_PHOTOS, child, databasePath, fileName: file.fileName})
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
    yield put({type: REMOVE_PHOTO, databasePath: data.val().databasePath})
  }
}

function* triggerGetInfoChild() {
  const {infoIds} = yield select(state => state.trainerReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_INFO_CHILD)
    const name = data.val().name
    const picture = data.val().picture
    const child = {name, picture}
    const id = data.val().deviceId
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
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], startClientDataPrefetch)
  yield fork(takeLatest, [REHYDRATE, INIT_DATA], triggerGetMessagesClientChild)
}
