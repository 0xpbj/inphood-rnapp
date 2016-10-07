import {
  LOGIN_SUCCESS, CLIENT_APP_INVITE, FRIEND_APP_INVITE, APP_INVITE_ERROR
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import Config from 'react-native-config'
import firebase from 'firebase'
import branch from 'react-native-branch'

// Subscribe to incoming links (both branch & non-branch)
function* watchBranch() {
  branch.subscribe(({params, error, uri}) => {
    if (params) { 
      console.log('Params')
      console.log(params)
      const {id, referralType} = params
      console.log(installParams)
      const token = yield select(state => state.authReducer)
      if (id && id.token !== token && referralType === 'client') {
        const client = id.token
        const path = '/global/' + token + '/trainerInfo/clientId'
        const key = yield call(db.newKey, path)
        yield call(db.update, path, client)
      }
    }
  })
}

const getLastParams = () => {
  return branch.getLatestReferringParams()
  .then(lastParams => ({lastParams}))
}

const getInstallParams = () => {
  return branch.getFirstReferringParams()
  .then(installParams => ({installParams}))
}

const showShareSheet = (branchUniversalObject, shareOptions, linkProperties, controlParams) => {
  return branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
  .then((channel, completed) => ({channel, completed}))
}

const getUrl = (branchUniversalObject, linkProperties, controlParams) => {
  return branchUniversalObject.generateShortUrl(linkProperties, controlParams)
  .then(shareUrl => ({shareUrl}))
}

//todo: check param if trainer is already setup
function* setupTrainer() {
  const installParams = yield call(getInstallParams)
  const {id, referralType} = installParams
  console.log(installParams)
  const token = yield select(state => state.authReducer)
  if (id && id.token !== token && referralType === 'client') {
    const trainerId = id.token
    firebase.database().ref('/global/' + token + '/userInfo/public').update({
      trainerId
    })
  }
}

function* branchInvite() {
  while (true) {
    try {
      const {referralType} = yield take([CLIENT_APP_INVITE, FRIEND_APP_INVITE])
      const {token} = yield select(state => state.authReducer)
      const branchUniversalObject = branch.createBranchUniversalObject
      (
        'canonicalIdentifier', 
        {
          metadata: 
          {
            id: {token},
            referralType: {referralType}
          }, 
          contentTitle: 'inPhood Invite', 
          contentDescription: 'Sending invite for inPhood'
        }
      )
      const shareOptions = { 
        messageHeader: 'inPhood App Invite', 
        messageBody: 'Computer Vision enhanced food journaling' 
      }
      const linkProperties = { 
        feature: 'share', 
        channel: 'ios' 
      }
      const {channel, completed} = yield call(showShareSheet, branchUniversalObject, shareOptions, linkProperties)
    }
    catch (error) {
      console.log('Error: ', error)
      yield put({type: APP_INVITE_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, setupTrainer)
  yield fork(takeLatest, LOGIN_SUCCESS, watchBranch)
  yield fork(takeLatest, LOGIN_SUCCESS, branchInvite)
}