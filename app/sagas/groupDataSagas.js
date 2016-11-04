import {
  ADD_GROUP_PHOTOS, ADD_GROUP_INFOS, ADD_GROUP_MESSAGES, INIT_GROUP_DATA, REMOVE_PHOTO,
  syncAddedGroupPhotoChild, syncRemovedGroupPhotoChild,
  SYNC_ADDED_GROUP_PHOTO_CHILD, SYNC_REMOVED_GROUP_PHOTO_CHILD,
  syncAddedGroupMessagesChild, SYNC_ADDED_GROUP_MESSAGES_CHILD, 
  INIT_GROUP_MESSAGES, syncAddedGroupInfoChild, syncRemovedGroupInfoChild,
  SYNC_ADDED_GROUP_INFO_CHILD, SYNC_REMOVED_GROUP_INFO_CHILD, MARK_GROUP_PHOTO_READ,
  INCREMENT_GROUP_PHOTO_NOTIFICATION, DECREMENT_GROUP_PHOTO_NOTIFICATION,
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

function* startGroupDataPrefetch() {
  const {cdnPaths} = yield select(state => state.groupsReducer)
  for (let path in cdnPaths) {
    yield fork(prefetchData, cdnPaths[path])
  }
}

function* readGroupPhotoFlow() {
  while (true) {
    const data = yield take(MARK_GROUP_PHOTO_READ)
    const {path, uid} = data
    firebase.database().ref(path).update({'notifyTrainer': false})
    yield put({type: DECREMENT_GROUP_PHOTO_NOTIFICATION, databasePath: path, group: uid})
  }
}

function* triggerGetMessagesGroupChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GROUP_MESSAGES_CHILD)
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
    yield put ({type: ADD_GROUP_MESSAGES, messages, path})
    if (flag)
      yield put({type: INCREMENT_GROUP_PHOTO_NOTIFICATION, databasePath: path, group: uid})
    const prevMessages = yield select(state => state.chatReducer.messages)
    const count = yield select(state => state.chatReducer.count)
  }
}

function* syncGroupChatData() {
  while (true) {
    const data = yield take (INIT_GROUP_MESSAGES)
    const msgPath = data.path + '/messages'
    yield fork(db.sync, msgPath, {
      child_added: syncAddedGroupMessagesChild
    })
  }
}

function* triggerGetGroupPhotoChild() {
  const {databasePaths} = yield select(state => state.groupsReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GROUP_PHOTO_CHILD)
    if (data.val().visible) {
      const file = data.val()
      const uid = file.uid
      const cdnPath = turlHead+file.fileName
      const databasePath = file.databasePath
      const time = file.time
      var child = {}
      child[uid] = file
      if (file.notifyTrainer) {
        yield put({type: INCREMENT_GROUP_PHOTO_NOTIFICATION, databasePath, group: uid})
      }
      if (databasePaths.includes(databasePath) === false)
        yield put({type: ADD_GROUP_PHOTOS, child, databasePath, fileName: file.fileName})
      const messageData = file.messages
      const path = file.databasePath
      for (var keys in messageData) {
        const messages = messageData[keys]
        yield put ({type: ADD_GROUP_MESSAGES, messages, path})
      }
      yield put ({type: INIT_GROUP_MESSAGES, path})
    }
  }
}

function* triggerRemGroupPhotoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_GROUP_PHOTO_CHILD)
    yield put({type: REMOVE_PHOTO, databasePath: data.val().databasePath})
  }
}

function* triggerGetGroupInfoChild() {
  const {infos} = yield select(state => state.groupsReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GROUP_INFO_CHILD)
    const name = data.val().name
    const picture = data.val().picture
    const child = {name, picture}
    console.log('Data: ', data.val())
    if (infos.includes(name) === false)
      yield put({type: ADD_GROUP_INFOS, child})
  }
}

function* triggerRemGroupInfoChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_GROUP_INFO_CHILD)
    const child = data
  }
}

function* syncGroupData() {
  const {groupNames, groupInvitees} = yield select(state => state.groupsReducer)
  console.log('Group Info: ', groupNames, groupInvitees)
  for (let i = 0; i < groupInvitees.length; i++) {
    let path = '/global/' + groupInvitees[i] + '/groupData/' + groupNames[i]
    console.log('What path: ', path)
    // yield fork(db.sync, path + '/photoData', {
    //   child_added: syncAddedGroupPhotoChild,
    //   child_removed: syncRemovedGroupPhotoChild,
    // })
    yield fork(db.sync, path, {
      child_added: syncAddedGroupInfoChild,
      child_removed: syncRemovedGroupInfoChild,
    })
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], syncGroupData)
  // yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], syncGroupChatData)
  // yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], readGroupPhotoFlow)
  yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], triggerGetGroupInfoChild)
  yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], triggerRemGroupInfoChild)
  // yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], triggerGetGroupPhotoChild)
  // yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], triggerRemGroupPhotoChild)
  // yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], startGroupDataPrefetch)
  // yield fork(takeLatest, [REHYDRATE, INIT_GROUP_DATA], triggerGetMessagesGroupChild)
}