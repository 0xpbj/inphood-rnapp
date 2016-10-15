import {
  LOGIN_SUCCESS, INIT_CHAT_SAGA, INIT_MESSAGES, ADD_MESSAGES, MSG_COUNT,
  syncAddedMessagesClientChild, syncRemovedMessagesClientChild,
  SYNC_ADDED_MESSAGES_CLIENT_CHILD, SYNC_REMOVED_MESSAGES_CLIENT_CHILD,
  STORE_CHAT_SUCCESS, STORE_CHAT_ERROR, MARK_MESSAGE_READ,
  INCREMENT_TRAINER_NOTIFICATION, DECREMENT_TRAINER_NOTIFICATION,
  INCREMENT_CLIENT_NOTIFICATION, DECREMENT_CLIENT_NOTIFICATION,
  INCREMENT_CLIENT_CHAT_NOTIFICATION, DECREMENT_CLIENT_CHAT_NOTIFICATION,
  INCREMENT_TRAINER_CHAT_NOTIFICATION, DECREMENT_TRAINER_CHAT_NOTIFICATION,
  syncCountClientMessagesChild, SYNC_COUNT_CLIENT_MESSAGES_CHILD
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import Config from '../constants/config-vars'

import firebase from 'firebase'

const turlHead = Config.AWS_CDN_THU_URL

function* triggerGetClientMessagesCount() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_COUNT_CLIENT_MESSAGES_CHILD)
    const count = data.numChildren()
    yield put({type: MSG_COUNT, count})
    if (count === 0) {
      yield put({type: INIT_MESSAGES})
    }
  }
}

function* triggerGetMessagesClientChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CLIENT_CHILD)
    const messages = data.val()
    const photo = messages.photo
    let id = yield select(state => state.authReducer.token)
    if (!id) {
      id = firebase.auth().currentUser.uid
    }
    const uid  = messages.uid
    const path = '/global/' + uid + '/photoData/' + photo
    const file = turlHead + uid + '/' + photo + '.jpg'
    yield put ({type: ADD_MESSAGES, messages, photo})
    // const visible = (yield call(db.getPath, path + '/visible')).val()
    // if (messages.clientRead === false && visible && id !== uid) {
    if (messages.clientRead === false && id !== uid) {
      yield put({type: INCREMENT_CLIENT_NOTIFICATION})
      yield put({type: INCREMENT_CLIENT_CHAT_NOTIFICATION, photo: file, path})
    }
    const prevMessages = yield select(state => state.chatReducer.messages)
    const count = yield select(state => state.chatReducer.count)
    if (prevMessages.length === count) {
      yield put({type: INIT_MESSAGES})
    }
  }
}

function* triggerRemMessagesClientChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_MESSAGES_CLIENT_CHILD)
    const child = data
  }
}

function* syncChatData() {
  let uid = yield select(state => state.authReducer.token)
  if (!uid) {
    uid = firebase.auth().currentUser.uid
  }
  let path = '/global/' + uid + '/messages'
  yield fork(db.sync, path, {
    value: syncCountClientMessagesChild,
    child_added: syncAddedMessagesClientChild,
    child_removed: syncRemovedMessagesClientChild,
  })
}

function* sendChatData() {
  try {
    let uid = yield select(state => state.authReducer.token)
    if (!uid) {
      uid = firebase.auth().currentUser.uid
    }
    const trainer = (yield select(state => state.authReducer.result)).trainerId
    const client = yield select(state => state.chatReducer.client)
    const {chatMessages, feedbackPhoto} = yield select(state => state.chatReducer)
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const key = firebase.database().ref('/global/' + client + '/messages').push()
    const createdAt = Date.now()
    let clientRead = false
    let trainerRead = false
    if (trainer) {
      clientRead = true
      const path = '/global/' + uid + '/photoData/' + photo
      firebase.database().ref(path).update({'notifyTrainer': true})
      const data = turlHead + uid + '/' + photo + '.jpg'
      yield put({type: INCREMENT_TRAINER_NOTIFICATION, uid})
      yield put({type: INCREMENT_TRAINER_CHAT_NOTIFICATION, uid, photo: data, path})
    }
    else {
      trainerRead = true
    }
    key.set({
      "key": key.key,
      uid,
      trainer,
      photo,
      createdAt,
      clientRead,
      trainerRead,
      "message": chatMessages[0]
    })
    yield put ({type: STORE_CHAT_SUCCESS})
  }
  catch(error) {
    console.log(error)
    yield put ({type: STORE_CHAT_ERROR, error})
  }
}

function* watchFirebaseChatFlow() {
  while (true) {
    yield take(INIT_CHAT_SAGA)
    yield fork(sendChatData)
  }
}

function* readFirebaseChatFlow() {
  while (true) {
    const data = yield take(MARK_MESSAGE_READ)
    const photo = data.photo + '.jpg'
    const uid = data.uid
    const path = data.path
    if (data.trainer) {
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

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, syncChatData)
  yield fork(takeLatest, LOGIN_SUCCESS, watchFirebaseChatFlow)
  yield fork(takeLatest, LOGIN_SUCCESS, readFirebaseChatFlow)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerGetClientMessagesCount)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerGetMessagesClientChild)
  yield fork(takeLatest, LOGIN_SUCCESS, triggerRemMessagesClientChild)
}
