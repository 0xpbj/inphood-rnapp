import {
  LOGIN_SUCCESS, INIT_CHAT_SAGA,
  ADD_MESSAGES, LOAD_MESSAGES, LOAD_MESSAGES_ERROR,
  STORE_CHAT_SUCCESS, STORE_CHAT_ERROR, MARK_MESSAGE_READ, 
  DECREMENT_TRAINER_NOTIFICATION, INCREMENT_CLIENT_NOTIFICATION, DECREMENT_CLIENT_NOTIFICATION
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import * as db from './firebase'

function* sendChatData() {
  try {
    const uid = (yield select(state => state.authReducer.user)).uid
    const client = yield select(state => state.chatReducer.client)
    const {messages, feedbackPhoto} = yield select(state => state.chatReducer)
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const key = firebase.database().ref('/global/' + client + '/messages/' + photo).push()
    const createdAt = Date.now()
    let clientRead = false
    let trainerRead = false
    if (uid === client) {
      clientRead = true
    }
    else {
      trainerRead = true
    }
    key.set({
      uid,
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


const fetchChatData = (chatRef, messages) => {
  return chatRef.once('value')
  .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      messages[childSnapshot.key] = childSnapshot.val()
    })
  })
  .catch(error => {
    console.log("Value Added Error", error);
  })
}

function* getChatData() {
  try {
    const client = yield select(state => state.chatReducer.client)
    const {feedbackPhoto, previousMessages} = yield select(state => state.chatReducer)
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const path = '/global/' + client + '/messages/' + photo
    const chatRef = firebase.database().ref(path).orderByKey()
    var messages = []
    yield call(fetchChatData, chatRef, messages)
    yield put ({type: ADD_MESSAGES, messages, photo})
  }
  catch(error) {
    console.log(error)
    yield put ({type: STORE_CHAT_ERROR, error})
  }
}

function* appendFirebaseChatFlow() {
  while (true) {
    yield take(INIT_CHAT_SAGA)
    yield fork(getChatData)
  }
}

function* loadOldMessages() {
  try {
    const uid = (yield select(state => state.authReducer.user)).uid
    const path = '/global/' + uid + '/messages'
    const snapshot = yield call(db.getPath, path)
    var messages = []
    var count = 0
    snapshot.forEach(snapshot => {
      messages[snapshot.key] = snapshot.val()
      snapshot.forEach(message => {
        if (message.val().clientRead === false) {
          count = count + 1
        }
      })
    })
    for (let i = 0; i < count; i++) {
      yield put({type: INCREMENT_CLIENT_NOTIFICATION})
    }
    yield put ({type: LOAD_MESSAGES, messages})
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOAD_MESSAGES_ERROR, error})
  }
}

function* readFirebaseChatFlow() {
  while (true) {
    const data = yield take(MARK_MESSAGE_READ)
    if (data.trainer) {
      firebase.database().ref(data.path).update({'trainerRead': true})
      yield put({type: DECREMENT_TRAINER_NOTIFICATION})
    }
    else {
      firebase.database().ref(data.path).update({'clientRead': true})
      yield put({type: DECREMENT_CLIENT_NOTIFICATION})
    }
  }
}

export default function* rootSaga() {
  yield take(LOGIN_SUCCESS)
  yield fork(loadOldMessages)
  yield fork(watchFirebaseChatFlow)
  yield fork(appendFirebaseChatFlow)
  yield fork(readFirebaseChatFlow)
}
