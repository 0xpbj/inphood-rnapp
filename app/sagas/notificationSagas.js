import {
  ADD_CLIENT_NOTIFICATION,
  ADD_TRAINER_NOTIFICATION,
  INCREMENT_CLIENT_CHAT_NOTIFICATION, 
  INCREMENT_TRAINER_CHAT_NOTIFICATION,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION,
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import Config from 'react-native-config'

import firebase from 'firebase'

const turlHead = Config.AWS_CDN_THU_URL

function* setupClientChatNotification() {
  while (true) {
    const { payload: { data } } = yield take(INCREMENT_CLIENT_CHAT_NOTIFICATION)
    const {photo} = data
    const trainer = (yield select(state => state.authReducer.result)).trainerId
    const fireDate = Date.now()
    const alertBody = 'Trainer has sent a new message'
    const notification = {fireDate, alertBody}
    const oldCount = yield select(state => state.notificationReducer.client)
    const count = oldCount + 1
    yield put({type: ADD_CLIENT_NOTIFICATION, notification, count})
  }
}

function* setupTrainerChatNotification() {
  while (true) {
    const { payload: { data } } = yield take(INCREMENT_TRAINER_CHAT_NOTIFICATION)
    const {uid, photo} = data
    const info = yield select(state => state.trainerReducer.infos)[uid]
    const name = info.name
    const fireDate = Date.now()
    const alertBody = name + ' has sent a new message'
    const notification = {fireDate, alertBody}
    const oldCount = yield select(state => state.notificationReducer.trainer)
    const count = oldCount + 1
    yield put({type: ADD_TRAINER_NOTIFICATION, notification, count})
  }
}

function* setupTrainerPhotoNotification() {
  while (true) {
    const { payload: { data } } = yield take(INCREMENT_TRAINER_PHOTO_NOTIFICATION)
    const {uid, photo, time} = data
    const info = yield select(state => state.trainerReducer.infos)[uid]
    const name = info.name
    const fireDate = Date.now() + 300000
    const alertBody = name + ' has added a new meal photo'
    const notification = {fireDate, alertBody}
    const oldCount = yield select(state => state.notificationReducer.trainer)
    const count = oldCount + 1
    yield put({type: ADD_TRAINER_NOTIFICATION, notification, count})
  }
}

export default function* rootSaga() {
  yield fork(setupClientChatNotification)
  yield fork(setupTrainerChatNotification)
  yield fork(setupTrainerPhotoNotification)
}