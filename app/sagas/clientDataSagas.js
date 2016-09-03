import {
  ADD_PHOTOS, ADD_INFOS, CLIENT_ADD_MESSAGES, INIT_DATA, INIT_MESSAGES, PHOTOS_COUNT,
  syncCountPhotoChild, syncAddedPhotoChild, syncRemovedPhotoChild,
  SYNC_COUNT_PHOTO_CHILD, SYNC_ADDED_PHOTO_CHILD, SYNC_REMOVED_PHOTO_CHILD,
  syncAddedInfoChild, syncRemovedInfoChild,
  SYNC_ADDED_INFO_CHILD, SYNC_REMOVED_INFO_CHILD,
  syncAddedMessagesChild, syncRemovedMessagesChild,
  SYNC_ADDED_MESSAGES_CHILD, SYNC_REMOVED_MESSAGES_CHILD,
} from '../constants/ActionTypes'

import * as db from './firebase'
import { Image } from "react-native"
import {fork, put, select, take} from 'redux-saga/effects'
import Config from 'react-native-config'

const turlHead = Config.AWS_CDN_THU_URL
const urlHead = Config.AWS_CDN_IMG_URL

function* triggerGetPhotoCount() {
  let clientCount = 0;
  while (true) {
    const { payload: { data } } = yield take(SYNC_COUNT_PHOTO_CHILD)
    if (data.key === 'photoData') {
      const count = data.numChildren()
      yield put({type: PHOTOS_COUNT, count})
      const {clients, photos, photosCount} = yield select(state => state.trainerReducer)
      if (photos.length === photosCount) {
        clientCount++
        if (clients.length === clientCount) {
          yield put({type: INIT_MESSAGES})
        }
      }
    }
  }
}

function* triggerGetMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CHILD)
    const child = data
    yield put({type: CLIENT_ADD_MESSAGES, child})
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
    const id = data.ref.parent.path.o[1]
    const child = {id, data}
    yield put({type: ADD_INFOS, child})
  }  
}

function* triggerRemInfoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_INFO_CHILD)
    const child = data
  }
}

function* triggerGetPhotoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_PHOTO_CHILD)
    const file = data.val()
    const uid = file.uid
    // const thumb = turlHead+file.fileName
    const photo = turlHead+file.fileName
    const caption = file.caption
    const title = file.title
    const mealType = file.mealType
    const time = file.time
    const localFile = file.localFile
    var prefetchTask = Image.prefetch(photo)
    prefetchTask
    .then(() => {})
    .catch(error => {})
    const obj = {photo,caption,mealType,time,title,localFile}
    var child = {}
    child[uid] = obj
    yield put({type: ADD_PHOTOS, child})
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
    let path = '/global/' + clients[i].val()
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

export default function* rootSaga() {
  yield take(INIT_DATA)
  yield fork(syncData)
  yield fork(triggerGetPhotoCount)
  yield fork(triggerGetPhotoChild)
  yield fork(triggerRemPhotoChild)
  yield fork(triggerGetInfoChild)
  yield fork(triggerRemInfoChild)
  yield fork(triggerGetMessagesChild)
  yield fork(triggerRemMessagesChild)
}