import {
  ADD_MESSAGES, INIT_MESSAGES,
  syncAddedMessagesChild, syncRemovedMessagesChild,
  SYNC_ADDED_MESSAGES_CHILD, SYNC_REMOVED_MESSAGES_CHILD,
} from '../constants/ActionTypes'

import * as db from './firebase'
import {fork, put, select, take} from 'redux-saga/effects'

function* triggerGetMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_MESSAGES_CHILD)
    const child = data
    yield put({type: ADD_MESSAGES, child})
  }  
}

function* triggerRemMessagesChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_MESSAGES_CHILD)
    const child = data
  }
}

function* syncMessages() {
  let photos = yield select(state => state.trainerReducer.photos)
  // for (let i = 0; i < photos.length; i++) {
  //   const uid = photos[i].data.child('uid').val()
  //   const file = photos[i].data.child('fileTail').val()
  //   let path = '/global/' + uid + '/messages/' + file
  //   yield fork(db.sync, path, {
  //     child_added: syncAddedMessagesChild,
  //     child_removed: syncRemovedMessagesChild,
  //   })
  // }
}

export default function* rootSaga() {
  yield take(INIT_MESSAGES)
  yield fork(syncMessages)
  yield fork(triggerGetMessagesChild)
  yield fork(triggerRemMessagesChild)
}