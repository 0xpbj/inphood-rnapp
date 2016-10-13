import {
  ADD_CLIENT_NOTIFICATION,
  ADD_TRAINER_NOTIFICATION,
  INCREMENT_CLIENT_CHAT_NOTIFICATION, 
  INCREMENT_TRAINER_CHAT_NOTIFICATION,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION,
} from '../constants/ActionTypes'

import {call, fork, put, select, take} from 'redux-saga/effects'
import * as db from './firebaseCommands'

function* setupClientChatNotification() {
  while (true) {
    const {path, photo} = yield take(INCREMENT_CLIENT_CHAT_NOTIFICATION)
    const trainer = (yield select(state => state.authReducer.result)).trainerId
    const notification = 'Your trainer has sent a new message'
    yield put({type: ADD_CLIENT_NOTIFICATION, notification})
  }
}

function* setupTrainerChatNotification() {
  while (true) {
    const {uid, photo, path} = yield take(INCREMENT_TRAINER_CHAT_NOTIFICATION)
    const public_path = '/global/' + uid + '/userInfo/public'
    const name = (yield call(db.getPath, public_path + '/name')).val()
    const notification = name + ' has sent a new message'
    yield put({type: ADD_TRAINER_NOTIFICATION, notification})
  }
}

function* setupTrainerPhotoNotification() {
  while (true) {
    const {uid, photo, time} = yield take(INCREMENT_TRAINER_PHOTO_NOTIFICATION)
    const path = '/global/' + uid + '/userInfo/public'
    const name = (yield call(db.getPath, path + '/name')).val()
    const notification = name + ' has added a new meal photo'
    yield put({type: ADD_TRAINER_NOTIFICATION, notification})
  }
}

export default function* rootSaga() {
  yield fork(setupClientChatNotification)
  yield fork(setupTrainerChatNotification)
  yield fork(setupTrainerPhotoNotification)
}