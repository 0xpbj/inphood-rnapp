import {
  ADD_PHOTOS, ADD_INFOS, ADD_MESSAGES, LOAD_MESSAGES, ADD_CLIENTS, INIT_DATA,
  syncCountPhotoChild, syncAddedPhotoChild, syncRemovedPhotoChild,
  SYNC_COUNT_PHOTO_CHILD, SYNC_ADDED_PHOTO_CHILD, SYNC_REMOVED_PHOTO_CHILD,
  syncAddedInfoChild, syncRemovedInfoChild,
  SYNC_ADDED_INFO_CHILD, SYNC_REMOVED_INFO_CHILD,
  syncAddedMessagesChild, syncRemovedMessagesChild,
  SYNC_ADDED_MESSAGES_CHILD, SYNC_REMOVED_MESSAGES_CHILD,
  MARK_PHOTO_READ, INCREMENT_TRAINER_NOTIFICATION, DECREMENT_TRAINER_NOTIFICATION,
  INCREMENT_TRAINER_CHAT_NOTIFICATION, INCREMENT_TRAINER_PHOTO_NOTIFICATION, DECREMENT_TRAINER_PHOTO_NOTIFICATION
} from '../constants/ActionTypes'

import * as db from './firebaseCommands'
import { Image } from "react-native"
import {call, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import Config from 'react-native-config'

import firebase from 'firebase'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

function* triggerGetMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CHILD)
    const messages = data.val()
    const photo = messages.photo
    yield put ({type: ADD_MESSAGES, messages, photo})
    if (messages.trainerRead === false) {
      const uid  = messages.uid
      const path = '/global/' + uid + '/photoData/' + photo
      const info = turlHead + uid + '/' + photo + '.jpg'
      yield put({type: INCREMENT_TRAINER_NOTIFICATION, uid})
      yield put({type: INCREMENT_TRAINER_CHAT_NOTIFICATION, uid, photo: info})
    }
  }
}

function* triggerRemMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_MESSAGES_CHILD)
    const child = data
  }
}

function* triggerGetInfoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_INFO_CHILD)
    const name = data.val().name
    const picture = data.val().picture
    const child = {name, picture}
    const id = data.ref.parent.path.o[1]
    const info = {id, child}
    yield put({type: ADD_INFOS, child: info})
  }
}

function* triggerRemInfoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_INFO_CHILD)
    const child = data
  }
}

const delayDisplay = (displayTime) => {
  while (true) {
    if (Date.now() > displayTime) {
      return
    }
  }
}

const getSize = (photo) => {
  while (true) {
    return Image.getSize(photo)
  }
}

const prefetchData = (photo) => {
  return Image.prefetch(photo)
    .then(() => {})
    .catch(error => {console.log(error + ' - ' + photo)})
}

function* triggerGetPhotoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_PHOTO_CHILD)
    if (data.val().visible) {
      const file = data.val()
      const uid = file.uid
      // const thumb = turlHead+file.fileName
      const photo = turlHead+file.fileName
      const caption = file.caption
      const title = file.title
      const mealType = file.mealType
      const time = file.time
      const localFile = file.localFile
      const notification = file.notifyTrainer
      let displayTime = time + 300000
      yield call(delayDisplay, displayTime)
      yield fork(prefetchData, photo)
      const obj = {photo,caption,mealType,time,title,localFile,file,notification}
      var child = {}
      child[uid] = obj
      const path = '/global/' + uid + '/photoData/' + file.fileTail
      if (file.notifyTrainer) {
        yield put({type: INCREMENT_TRAINER_NOTIFICATION, uid})
        yield put({type: INCREMENT_TRAINER_PHOTO_NOTIFICATION, uid, time, photo})
      }
      yield put({type: ADD_PHOTOS, child})
    }
  }
}

function* triggerRemPhotoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_PHOTO_CHILD)
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
    yield fork(db.sync, path + '/messages', {
      child_added: syncAddedMessagesChild,
      child_removed: syncRemovedMessagesChild,
    })
    yield fork(db.sync, path + '/userInfo', {
      child_added: syncAddedInfoChild,
      child_removed: syncRemovedInfoChild,
    })
  }
}

function* readClientPhotoFlow() {
  while (true) {
    const data = yield take(MARK_PHOTO_READ)
    const {path, uid, photo} = data
    firebase.database().ref(path).update({'notifyTrainer': false})
    yield put({type: DECREMENT_TRAINER_NOTIFICATION, uid})
    yield put({type: DECREMENT_TRAINER_PHOTO_NOTIFICATION, photo})
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, INIT_DATA, syncData)
  yield fork(takeLatest, INIT_DATA, readClientPhotoFlow)
  yield fork(takeLatest, INIT_DATA, triggerGetInfoChild)
  yield fork(takeLatest, INIT_DATA, triggerRemInfoChild)
  yield fork(takeLatest, INIT_DATA, triggerGetPhotoChild)
  yield fork(takeLatest, INIT_DATA, triggerRemPhotoChild)
  yield fork(takeLatest, INIT_DATA, triggerGetMessagesChild)
  yield fork(takeLatest, INIT_DATA, triggerRemMessagesChild)
}