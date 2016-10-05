import {
  LOGIN_SUCCESS, CLIENT_APP_INVITE, TRAINER_APP_INVITE, FRIEND_APP_INVITE, APP_INVITE_ERROR
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import Config from 'react-native-config'
import firebase from 'firebase'
import branch from 'react-native-branch'

const branchUrl = Config.BRANCH_URL

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
  // params from last open
  return branch.getLatestReferringParams()
  .then(lastParams => ({lastParams}))
}

const getInstallParams = () => {
  // params from original install
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

const registerView = (branchUniversalObject) => {
  return branchUniversalObject.registerView()
  .then(viewResult => ({viewResult}))
}

const listOnSpotlight = (branchUniversalObject) => {
  return branchUniversalObject.listOnSpotlight()
  .then(spotlightResult => ({spotlightResult}))
}

function* branchInvite() {
  while (true) {
    try {
      yield take([CLIENT_APP_INVITE, TRAINER_APP_INVITE, FRIEND_APP_INVITE])
      const {token} = yield select(state => state.authReducer)
      const lastParams = yield call(getLastParams)
      const installParams = yield call(getInstallParams)
      const branchUniversalObject = branch.createBranchUniversalObject(
        'canonicalIdentifier', 
        {
          metadata: 
          {
            id: {token}, 
          }, 
          contentTitle: 'inPhood Invite', 
          contentDescription: 'Sending invit for inPhood'
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
      const controlParams = { 
        $desktop_url: {branchUrl}
      }
      const {channel, completed} = yield call(showShareSheet, branchUniversalObject, shareOptions, linkProperties, controlParams)
      const {shareUrl} = yield call(getUrl, branchUniversalObject, linkProperties, controlParams)
      // console.log('shareUrl: ', shareUrl)
      // const {viewResult} = yield call(registerView, branchUniversalObject)
      // console.log('viewResult: ', viewResult)
      // const {spotlightResult} = yield call(listOnSpotlight, branchUniversalObject)
      // console.log('spotlightResult: ', spotlightResult)
    }
    catch (error) {
      console.log('Error: ', error)
      yield put({type: APP_INVITE_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, watchBranch)
  yield fork(takeLatest, LOGIN_SUCCESS, branchInvite)
}