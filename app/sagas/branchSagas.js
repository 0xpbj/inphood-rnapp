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
      /* handle branch link */
      //need to firebase connection here
      console.log('Params')
      console.log(params)
    }
    else { 
      /* handle uri */ 
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

function* watchInstalls() {
  const installParams = yield call(getInstallParams)
  console.log('Install Params: ', installParams)
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
        },
        'one_time_use': true
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
      const {shareUrl} = yield call(getUrl, branchUniversalObject, linkProperties)
      console.log(shareUrl)
    }
    catch (error) {
      console.log('Error: ', error)
      yield put({type: APP_INVITE_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, watchInstalls)
  yield fork(takeLatest, LOGIN_SUCCESS, watchBranch)
  yield fork(takeLatest, LOGIN_SUCCESS, branchInvite)
}