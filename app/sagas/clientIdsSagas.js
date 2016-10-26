import {
  LOGIN_SUCCESS, ADD_CLIENTS, INIT_DATA, NUMBER_OF_CLIENTS,
  syncCountClientIdChild, syncAddedClientIdChild, syncRemovedClientIdChild,
  SYNC_COUNT_CLIENTID_CHILD, SYNC_ADDED_CLIENTID_CHILD, SYNC_REMOVED_CLIENTID_CHILD,
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import * as db from './firebaseCommands'
import {fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import firebase from 'firebase'

function* triggerGetClientIdCount() {
  const {numClients} = yield select(state => state.trainerReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_COUNT_CLIENTID_CHILD)
    const count = data.numChildren()
    if (numClients !== count) {
      yield put({type: NUMBER_OF_CLIENTS, count})
      const {clients} = yield select(state => state.trainerReducer)
      if (clients.length === count) {
        yield put({type: INIT_DATA})
      }
    }
  }
}

function* triggerGetClientIdChild() {
  const {clients} = yield select(state => state.trainerReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_CLIENTID_CHILD)
    const child = data.val().token
    if (clients.includes(child) === false)
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
  let uid = yield select(state => state.authReducer.token)
  if (uid === '' && firebase.auth().currentUser) {
    uid = firebase.auth().currentUser.uid
  }
  if (uid !== '') {
    let path = '/global/' + uid + '/trainerInfo'
    yield fork(db.sync, path, {
      child_added: syncCountClientIdChild,
    })
    yield fork(db.sync, path + '/clientId', {
      child_added: syncAddedClientIdChild,
      child_removed: syncRemovedClientIdChild,
    })
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], syncClientId)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetClientIdCount)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetClientIdChild)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerRemClientIdChild)
}