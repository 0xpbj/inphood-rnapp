import { fork } from 'redux-saga/effects'
import aws from './awsSagas'
import login from './loginSagas'
import database from './databaseSagas'
import firebase from './firebaseSagas'
import clients from './clientIdsSagas'
import data from './clientDataSagas'
import messages from './clientMessagesSagas'

export default function* rootSaga() {
  yield fork(aws)
  yield fork(login)
  yield fork(database)
  yield fork(firebase)
  yield fork(clients)
  yield fork(data)
  yield fork(messages)
}
