import {
  LOGIN_SUCCESS,
  INIT_CHAT_SAGA,
  STORE_CHAT_DATA_SUCCESS,
  STORE_CHAT_DATA_ERROR,
  LOAD_MESSAGES_ERROR,
  LOAD_MESSAGES_SUCCESS,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

export const storeChatData = (uid, messages, feedbackPhoto) => {
  let photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
  let key = firebase.database().ref('/global/' + uid + '/userData/' + photo + '/messages').push()
  key.set({
    "time": Date.now(),
    "content": messages[0]
  })
}

export function* sendChatData(messages, feedbackPhoto) {
  try {
    let uid = firebase.auth().currentUser.uid
    yield call(storeChatData, uid, messages, feedbackPhoto)
    yield put ({type: STORE_CHAT_DATA_SUCCESS})
  }
  catch(error) {
    console.log(error)
    yield put ({type: STORE_CHAT_DATA_ERROR, error})
  }
}

export function* watchFirebaseChatFlow() {
  while (true) {
    yield take(INIT_CHAT_SAGA)
    const state = yield select()
    let messages = state.chatReducer.messages
    let feedbackPhoto = state.chatReducer.feedbackPhoto
    yield fork(sendChatData, messages, feedbackPhoto)
  }
}


const oldMessages = (messages) => {
  let user = firebase.auth().currentUser
  return firebase.database().ref('/global/' + user.uid + '/userData').orderByKey().once('value')
  .then (function(snapshot){
    return snapshot.forEach(function(childSnapshot) {
      let picture = childSnapshot.child('immutable/fileTail').val()
      let data = childSnapshot.child('messages').val()
      let obj = {picture, data}
      messages.push(obj)
    })
  }, function(error) {
    console.log("Value Added Error", error);
  })
}

function* loadOldMessages() {
  try {
    var messages = []
    yield call(oldMessages, messages)
    yield put ({type: LOAD_MESSAGES_SUCCESS, messages})
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOAD_MESSAGES_ERROR, error})
  }
}

export function* watchOldFirebaseChatFlow() {
  while (true) {
    yield take(LOGIN_SUCCESS)
    yield call(loadOldMessages)
  }
}
