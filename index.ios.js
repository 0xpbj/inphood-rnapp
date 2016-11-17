'use strict'

import React, { Component } from "react"
import {Alert, AppRegistry} from "react-native"

import configureStore from './app/store/configureStore'
const store = configureStore()

import AppContainer from './app/containers/AppContainer'
import { Provider } from 'react-redux'

import PushNotification from 'react-native-push-notification'

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    // console.log( 'TOKEN:', token )
  },
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    // Alert.alert(
    //   'inPhood Message',
    //   notification.message,
    //   [{
    //     text: 'Dismiss',
    //     onPress: null,
    //   }]
    // )
    // console.log( 'NOTIFICATION:', notification )
  },
  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: "YOUR GCM SENDER ID",
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
      alert: true,
      badge: true,
      sound: true
  },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
})

const App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
)

AppRegistry.registerComponent('inPhoodRN', () => App)