import {
  LOGIN_SUCCESS, CLIENT_APP_INVITE, FRIEND_APP_INVITE, APP_INVITE_ERROR,
  BRANCH_REFERRAL_INFO, BRANCH_AUTH_TRAINER, SEND_AWS_SUCCESS
} from '../constants/ActionTypes'

import {REHYDRATE} from 'redux-persist/constants'
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
      // const {id, referralType} = params
      // const token = firebase.auth().currentUser.uid
      // if (id && id.token !== token && referralType === 'client') {
      //   const client = id.token
      //   const path = '/global/' + token + '/trainerInfo/clientId'
      //   firebase.database().ref(path).push({client})
      // }
    }
  })
}

function* setupClient() {
  const {authTrainer, referralType, token, referralId} = yield select(state => state.authReducer)
  if (authTrainer === 'pending' && referralType === 'client') {
    const data = yield take(BRANCH_AUTH_TRAINER)
    const {response} = data
    firebase.database().ref('/global/' + token + '/userInfo/public').update({authTrainer: response})
    if (response === 'accept') {
      const path = '/global/' + referralId + '/trainerInfo/clientId'
      firebase.database().ref(path).push({token})
    }
  }
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

function* setupTrainer() {
  const {referralId} = yield select(state => state.authReducer)
  if (referralId === '' || referralId === null) {
    const lastParams = yield call(getLastParams)
    const {id, referral, trainer} = lastParams.lastParams
    const {token} = yield select(state => state.authReducer)
    if (id && id.token !== token && referral && referral.referralType === 'client') {
      let referralType = referral.referralType
      const trainerId = id.token
      const trainerName = trainer.name
      yield put({type: BRANCH_REFERRAL_INFO, referralType, referralSetup: true, referralId: trainerId, trainerName})
      firebase.database().ref('/global/' + token + '/userInfo/public').update({
        trainerId,
        referralSetup,
        referralType,
        trainerName,
        authTrainer: 'pending',
        referralId: trainerId
      })
    }
    else if (id && id.token !== token && referral && referral.referralType === 'friend') {
      let referralType = referral.referralType
      let friendId = id.token
      yield put({type: BRANCH_REFERRAL_INFO, referralType, referralSetup: true, referralId: friendId, trainerName: ''})
      firebase.database().ref('/global/' + token + '/userInfo/public').update({
        referralSetup,
        referralType,
        authTrainer: 'decline',
        referralId: id.token
      })
    }
  }
}

function* branchInvite() {
  while (true) {
    try {
      const {referralType} = yield take([CLIENT_APP_INVITE, FRIEND_APP_INVITE])
      const {token, settings} = yield select(state => state.authReducer)
      const name = settings.first_name
      const branchUniversalObject = branch.createBranchUniversalObject
      (
        'canonicalIdentifier', 
        {
          metadata: 
          {
            id: {token},
            trainer: {name},
            referral: {referralType}
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
  // yield fork(takeLatest, LOGIN_SUCCESS, watchBranch)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], setupClient)
  yield fork(takeLatest, LOGIN_SUCCESS, branchInvite)
}