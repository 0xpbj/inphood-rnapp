import {
  LOGIN_SUCCESS, INIT_CHAT_SAGA, INIT_MESSAGES,
  ADD_MESSAGES, LOAD_MESSAGES, LOAD_MESSAGES_ERROR,
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
import * as db from './firebaseCommands'
import Config from 'react-native-config'

import firebase from 'firebase'

const turlHead = Config.AWS_CDN_THU_URL

function* triggerGetClientMessagesCount() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_COUNT_CLIENT_MESSAGES_CHILD)
    const count = data.numChildren()
    const {previousMessages} = yield select(state => state.chatReducer)
    if (count === 0) {
      yield put({type: INIT_MESSAGES})
    }
    else if (previousMessages.length === count) {
      yield put({type: INIT_MESSAGES})
    }
  }
}

function* triggerGetMessagesClientChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CLIENT_CHILD)
    const messages = data.val()
    const photo = messages.photo
    yield put ({type: ADD_MESSAGES, messages, photo})
    if (messages.clientRead === false) {
      const uid  = messages.uid
      const path = '/global/' + uid + '/photoData/' + photo
      const info = turlHead + uid + '/' + photo + '.jpg'
      console.log('Read Chat Photo1: ' + info)
      yield put({type: INCREMENT_CLIENT_NOTIFICATION})
      yield put({type: INCREMENT_CLIENT_CHAT_NOTIFICATION, photo: info})
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
  let path = '/global/' + uid
  yield fork(db.sync, path + '/messages', {
    value: syncCountClientMessagesChild,
  })
  yield fork(db.sync, path + '/messages', {
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
    const {messages, feedbackPhoto} = yield select(state => state.chatReducer)
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const key = firebase.database().ref('/global/' + client + '/messages').push()
    console.log(key.key)
    const createdAt = Date.now()
    let clientRead = false
    let trainerRead = false
    if (uid === client) {
      clientRead = true
      const path = '/global/' + uid + '/photoData/' + photo
      firebase.database().ref(path).update({'notifyTrainer': true})
      const data = turlHead + uid + '/' + photo + '.jpg'
      console.log('Write Chat Photo2: ' + data)
      yield put({type: INCREMENT_TRAINER_NOTIFICATION, uid})
      yield put({type: INCREMENT_TRAINER_CHAT_NOTIFICATION, photo: data})
    }
    else {
      trainerRead = true
    }
    key.set({
      uid,
      trainer,
      photo,
      createdAt,
      clientRead,
      trainerRead,
      "message": messages[0]
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
    console.log('Read Chat Photo2: ' + photo)
    if (data.trainer) {
      // firebase.database().ref(data.path).update({'trainerRead': true})
      yield put({type: DECREMENT_TRAINER_NOTIFICATION, uid})
      yield put({type: DECREMENT_TRAINER_CHAT_NOTIFICATION, photo})
    }
    else {
      // firebase.database().ref(data.path).update({'clientRead': true})
      yield put({type: DECREMENT_CLIENT_NOTIFICATION, uid})
      yield put({type: DECREMENT_CLIENT_CHAT_NOTIFICATION, photo})
    }
  }
}

export default function* rootSaga() {
  while (true) {
    yield take(LOGIN_SUCCESS)
    yield fork(triggerGetClientMessagesCount)
    yield fork(triggerGetMessagesClientChild)
    yield fork(triggerRemMessagesClientChild)
    yield fork(syncChatData)
    yield fork(watchFirebaseChatFlow)
    yield fork(readFirebaseChatFlow)
  }
}
