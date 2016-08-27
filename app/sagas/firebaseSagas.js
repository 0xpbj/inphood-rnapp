import {
  LOGIN_SUCCESS, INIT_CLIENTS, STORE_TRAINER,
  syncAddedRootChild, syncRemovedRootChild,
  SYNC_ADDED_ROOT_CHILD, SYNC_REMOVED_ROOT_CHILD,
} from '../constants/ActionTypes'

import * as db from './firebase'
import {fork, put, select, take} from 'redux-saga/effects'

function* triggerGetRootChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_ROOT_CHILD)
    const child = data.val()
    if (data.key === 'trainerInfo') {
      let flag = true
      yield put({type: STORE_TRAINER, flag})
      yield put({type: INIT_CLIENTS})
    }
  }
}

function* triggerRemRootChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_ROOT_CHILD)
    // console.log('Triggered Root Child Removed')
    // console.log(data.val())
  }
}

function* syncRoot() {
  let user = yield select(state => state.authReducer.user)
  let path = '/global/' + user.uid
  yield fork(db.sync, path, {
    child_added: syncAddedRootChild,
    child_removed: syncRemovedRootChild,
  })
}

export default function* rootSaga() {
  // yield take(LOGIN_SUCCESS)
  // yield fork(syncRoot)
  // yield fork(triggerGetRootChild)
  // yield fork(triggerRemRootChild)
}