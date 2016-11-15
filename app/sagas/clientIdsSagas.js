import {
  LOGIN_SUCCESS, ADD_CLIENTS, INIT_DATA, NUMBER_OF_CLIENTS,
  syncCountClientIdChild, syncAddedClientIdChild, syncRemovedClientIdChild,
  SYNC_COUNT_CLIENTID_CHILD, SYNC_ADDED_CLIENTID_CHILD, SYNC_REMOVED_CLIENTID_CHILD,
  REMOVE_CLIENT, REMOVE_CLIENT_ERROR
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import * as db from './firebaseCommands'
import {call, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import firebase from 'firebase'
import DeviceInfo from 'react-native-device-info'

const deviceId = DeviceInfo.getUniqueID()

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

const updateFirebaseMap = (uid, cDeviceId, remove) => {
  if (remove)
    firebase.database().ref('/global/deviceIdMap/' + uid + '/' + cDeviceId).remove()
  else
    firebase.database().ref('/global/deviceIdMap/' + uid + '/' + cDeviceId).set('client')
}

function* triggerGetClientIdChild() {
  const {clients} = yield select(state => state.trainerReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_CLIENTID_CHILD)
    const uid = firebase.auth().currentUser.uid
    const response = data.val()
    if (response === 'accept') {
      const child = data.key
      if (clients.includes(child) === false) {
        yield put({type: ADD_CLIENTS, child})
        yield call(updateFirebaseMap, uid, child, false)
      }
    }
  }
}

function* triggerRemClientIdChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_CLIENTID_CHILD)
    const uid = firebase.auth().currentUser.uid
    const child = data.key
    const {clients} = yield select(state => state.trainerReducer)
    if (clients.includes(child)) {
      yield put({type: REMOVE_CLIENT, child})
      yield put({type: INIT_DATA})
    }
  }
}

function* syncClientId() {
  let uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : ''
  if (uid !== '') {
    let path = '/global/' + deviceId + '/trainerInfo'
    yield fork(db.sync, path, {
      child_added: syncCountClientIdChild,
    })
    yield fork(db.sync, path + '/clientId', {
      child_added: syncAddedClientIdChild,
      child_removed: syncRemovedClientIdChild,
    })
  }
}

function* removeClient() {
  while (true) {
    const {child} = yield take(REMOVE_CLIENT)
    try {
      firebase.database().ref('/global/' + child + '/userInfo/public')
      .update({
        referralSetup: 'pending',
        referralName: '',
        referralDeviceId: '',
        referralType: '',
      })
      yield call(updateFirebaseMap, uid, child, true)
    }
    catch (error) {
      yield put({type: REMOVE_CLIENT_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], syncClientId)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetClientIdChild)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerRemClientIdChild)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetClientIdCount)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], removeClient)
}
