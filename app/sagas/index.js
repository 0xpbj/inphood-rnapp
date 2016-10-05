import { fork } from 'redux-saga/effects'
import aws from './awsSagas'
import login from './loginSagas'
import database from './databaseSagas'
import chat from './chatSagas'
import clients from './clientIdsSagas'
import data from './clientDataSagas'
import vision from './clarifaiSagas'
import branch from './branchSagas'

export default function* rootSaga() {
  yield fork(aws)
  yield fork(login)
  yield fork(database)
  yield fork(chat)
  yield fork(clients)
  yield fork(data)
  yield fork(vision)
  yield fork(branch)
}
