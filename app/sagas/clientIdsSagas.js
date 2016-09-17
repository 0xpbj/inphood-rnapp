import {
  LOGIN_SUCCESS, STORE_TRAINER, ADD_CLIENTS, INIT_DATA,
  syncCountClientIdChild, syncAddedClientIdChild, syncRemovedClientIdChild,
  SYNC_COUNT_CLIENTID_CHILD, SYNC_ADDED_CLIENTID_CHILD, SYNC_REMOVED_CLIENTID_CHILD,
} from '../constants/ActionTypes'

import * as db from './firebaseCommands'
import {fork, put, select, take} from 'redux-saga/effects'

import firebase from 'firebase'

function* triggerGetClientIdCount() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_COUNT_CLIENTID_CHILD)
    const count = data.numChildren()
    const {clients} = yield select(state => state.trainerReducer)
    if (clients.length === count) {
      yield put({type: INIT_DATA})
    }
  }
}

function* triggerGetClientIdChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_CLIENTID_CHILD)
    const child = data
    let flag = true
    yield put({type: STORE_TRAINER, flag})
    yield put({type: ADD_CLIENTS, child})
  }
}

function* triggerRemClientIdChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_CLIENTID_CHILD)
    const child = data
  }
}

function* syncClientId() {
  let user = yield select(state => state.authReducer.user)
  let path = '/global/' + user.uid + '/trainerInfo'
  yield fork(db.sync, path, {
    child_added: syncCountClientIdChild,
  })
  yield fork(db.sync, path + '/clientId', {
    child_added: syncAddedClientIdChild,
    child_removed: syncRemovedClientIdChild,
  })
}

export default function* rootSaga() {
  yield take(LOGIN_SUCCESS)
  yield fork(syncClientId)
  yield fork(triggerGetClientIdCount)
  yield fork(triggerGetClientIdChild)
  yield fork(triggerRemClientIdChild)
}
