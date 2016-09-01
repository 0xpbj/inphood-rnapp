import {
  LOGIN_SUCCESS, INIT_CHAT_SAGA,
  CLIENT_ADD_MESSAGES, CLIENT_LOAD_MESSAGES,
  STORE_CHAT_DATA_SUCCESS, STORE_CHAT_DATA_ERROR,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import * as db from './firebase'

function* sendChatData() {
  try {
    const user = yield select(state => state.authReducer.user)
    const {messages, feedbackPhoto} = yield select(state => state.clientChatReducer)
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const key = firebase.database().ref('/global/' + user.uid + '/messages/' + photo).push()
    key.set({
      "uid": user.uid,
      "photo": photo,
      "createdAt": Date.now(),
      "message": messages[0]
    })
    yield put ({type: STORE_CHAT_DATA_SUCCESS})
  }
  catch(error) {
    console.log(error)
    yield put ({type: STORE_CHAT_DATA_ERROR, error})
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
    const user = yield select(state => state.authReducer.user)
    let {feedbackPhoto, previousMessages} = yield select(state => state.clientChatReducer)
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const path = '/global/' + user.uid + '/messages/' + photo
    const chatRef = firebase.database().ref(path).orderByKey()
    var messages = []
    yield call(fetchChatData, chatRef, messages)
    yield put ({type: CLIENT_ADD_MESSAGES, messages, photo})
  }
  catch(error) {
    console.log(error)
    yield put ({type: STORE_CHAT_DATA_ERROR, error})
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
    const user = yield select(state => state.authReducer.user)
    const path = '/global/' + user.uid + '/messages'
    const snapshot = yield call(db.getPath, path)
    var messages = []
    snapshot.forEach(function(childSnapshot) {
      messages[childSnapshot.key] = childSnapshot.val()
    })
    yield put ({type: CLIENT_LOAD_MESSAGES, messages})
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOAD_MESSAGES_ERROR, error})
  }
}

export default function* rootSaga() {
  yield take(LOGIN_SUCCESS)
  yield fork(loadOldMessages)
  yield fork(watchFirebaseChatFlow)
  yield fork(appendFirebaseChatFlow)
}
