import {
  LOGIN_SUCCESS, BRANCH_REFERRAL_INFO, BRANCH_AUTH_TRAINER, 
  CLIENT_APP_INVITE, FRIEND_APP_INVITE, GROUP_APP_INVITE, 
  APP_INVITE_ERROR, APP_INVITE_SUCCESS, SEND_AWS_SUCCESS, 
  SETUP_CLIENT_ERROR, SETUP_TRAINER_ERROR, SETUP_GROUP_ERROR,
  RESET_BRANCH_INFO,
} from '../constants/ActionTypes'

import {REHYDRATE} from 'redux-persist/constants'
import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as db from './firebaseCommands'
import Config from '../constants/config-vars'
import firebase from 'firebase'
import branch from 'react-native-branch'

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

function* setupClient() {
  try {
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
  catch (error) {
    yield put({type: SETUP_CLIENT_ERROR})
  }
}

function* setupTrainer() {
  try {
    const {referralId} = yield select(state => state.authReducer)
    const lastParams = (yield call(getLastParams)).lastParams
    const installParams = (yield call(getInstallParams)).installParams
    if (referralId === '' || referralId === null || lastParams !== installParams) {
      const {id, referral, trainer} = lastParams
      const {token} = yield select(state => state.authReducer)
      if (id && id.token !== token && referral && referral.referralType === 'client') {
        let referralType = referral.referralType
        const trainerId = id.token
        const trainerName = trainer.name
        yield put({type: BRANCH_REFERRAL_INFO, referralType, referralSetup: true, referralId: trainerId, trainerName})
        firebase.database().ref('/global/' + token + '/userInfo/public').update({
          trainerId,
          referralSetup: true,
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
          referralSetup: true,
          referralType,
          authTrainer: 'decline',
          referralId: id.token
        })
      }
    }
  }
  catch (error) {
    yield put({type: SETUP_TRAINER_ERROR})
  }
}

function* branchInvite() {
  while (true) {
    try {
      const {referralType} = yield take([CLIENT_APP_INVITE, FRIEND_APP_INVITE, GROUP_APP_INVITE])
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
      yield put({type: APP_INVITE_SUCCESS})
    }
    catch (error) {
      yield put({type: APP_INVITE_ERROR})
    }
  }
}

export default function* rootSaga() {
  yield fork(takeLatest, LOGIN_SUCCESS, branchInvite)
  yield fork(takeLatest, LOGIN_SUCCESS, setupClient)
  yield fork(takeLatest, LOGIN_SUCCESS, setupTrainer)
}