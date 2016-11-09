import {
  LOGIN_SUCCESS, BRANCH_REFERRAL_INFO, BRANCH_AUTH_SETUP, 
  CLIENT_APP_INVITE, FRIEND_APP_INVITE, GROUP_APP_INVITE, 
  APP_INVITE_ERROR, APP_INVITE_SUCCESS, SEND_AWS_SUCCESS, 
  SETUP_CLIENT_ERROR, SETUP_REFERRAL_ERROR, SETUP_GROUP_ERROR,
  RESET_BRANCH_INFO,
} from '../constants/ActionTypes'

import {REHYDRATE} from 'redux-persist/constants'
import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import { Alert } from "react-native"
import * as db from './firebaseCommands'
import Config from '../constants/config-vars'
import firebase from 'firebase'
import branch from 'react-native-branch'
import DeviceInfo from 'react-native-device-info'

const deviceId = DeviceInfo.getUniqueID()

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
    const {authSetup, referralType, referralDeviceId, uid} = yield select(state => state.authReducer)
    if (authSetup === 'pending' && referralType === 'client') {
      const data = yield take(BRANCH_AUTH_SETUP)
      const {response} = data
      firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({authSetup: response})
      if (response === 'accept') {
        firebase.database().ref('/global/deviceIdMap/' + uid + '/' + referralDeviceId).set(referralType)
        const path = '/global/' + referralDeviceId + '/trainerInfo/clientId/' + deviceId
        firebase.database().ref(path).set('client')
      }
    }
  }
  catch (error) {
    yield put({type: SETUP_CLIENT_ERROR})
  }
}

function* setupTrainer() {
  try {
    const lastParams = (yield call(getLastParams)).lastParams
    const installParams = (yield call(getInstallParams)).installParams
    const {referralType, referralName, referralDeviceId} = lastParams
    console.log(lastParams, installParams)
    if (lastParams && (referralDeviceId !== deviceId || lastParams !== installParams)) {
      const {uid} = yield select(state => state.authReducer)
      yield put({type: BRANCH_REFERRAL_INFO, referralType, referralSetup: true, referralDeviceId, referralName})
      firebase.database().ref('/global/' + deviceId + '/userInfo/public').update({
        referralSetup: true,
        referralType,
        referralName,
        authSetup: (referralType === 'client') ? 'pending' : 'decline',
        referralDeviceId,
        uid
      })
    }
  }
  catch (error) {
    console.log(error)
    yield put({type: SETUP_REFERRAL_ERROR})
  }
}

function* branchInvite() {
  while (true) {
    try {
      const {referralType, name} = yield take([CLIENT_APP_INVITE, FRIEND_APP_INVITE])
      const {uid, settings, deviceId} = yield select(state => state.authReducer)
      const referralName = settings.first_name
      const branchUniversalObject = branch.createBranchUniversalObject
      (
        'canonicalIdentifier', 
        {
          metadata: 
          {
            referralName,
            referralDeviceId: deviceId,
            referralType,
            referralName,
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
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], branchInvite)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], setupClient)
  yield fork(takeLatest, [REHYDRATE, LOGIN_SUCCESS], setupTrainer)
}