import {
  LOGIN_SUCCESS, ADD_GROUPS, INIT_GROUP_DATA, NUMBER_OF_GROUPS,
  syncCountGroupsChild, syncAddedGroupsChild, syncRemovedGroupsChild,
  SYNC_COUNT_GROUPS_CHILD, SYNC_ADDED_GROUPS_CHILD, SYNC_REMOVED_GROUPS_CHILD,
} from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

import * as db from './firebaseCommands'
import {fork, put, select, take} from 'redux-saga/effects'
import {takeLatest} from 'redux-saga'
import firebase from 'firebase'

function* triggerGetGroupsCount() {
  const {numGroups} = yield select(state => state.groupsReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_COUNT_GROUPS_CHILD)
    if (data.key === 'groups') {
      const count = data.numChildren()
      if (numGroups !== count) {
        yield put({type: NUMBER_OF_GROUPS, count})
        const {groupNames} = yield select(state => state.groupsReducer)
        if (groupNames.length === count) {
          yield put({type: INIT_GROUP_DATA})
        }
      }
    }
  }
}

function* triggerGetGroupsChild() {
  const {groupNames} = yield select(state => state.groupsReducer)
  while (true) {
    const { payload: { data } } = yield take(SYNC_ADDED_GROUPS_CHILD)
    if (groupNames.includes(data.key) === false)
      yield put({type: ADD_GROUPS, name: data.key, invitee: data.val().invitee})
  }
}

function* triggerRemGroupsChild() {
  while (true) {
    const { payload: { data } } = yield take(SYNC_REMOVED_GROUPS_CHILD)
    const child = data
  }
}

function* syncGroups() {
  let uid = yield select(state => state.authReducer.token)
  if (uid === '' && firebase.auth().currentUser) {
    uid = firebase.auth().currentUser.uid
  }
  if (uid !== '') {
    let path = '/global/' + uid + '/userInfo/public'
    yield fork(db.sync, path, {
      child_added: syncCountGroupsChild,
    })
    yield fork(db.sync, path + '/groups', {
      child_added: syncAddedGroupsChild,
      child_removed: syncRemovedGroupsChild,
    })
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], syncGroups)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetGroupsCount)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerGetGroupsChild)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], triggerRemGroupsChild)
}