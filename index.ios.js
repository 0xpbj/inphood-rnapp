/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
/* @flow */

'use strict';

import React, { Component } from "react";
import {AppRegistry} from "react-native";

import configureStore from './app/store/configureStore'
const store = configureStore()

import HomeContainer from './app/containers/HomeContainer'
import { Provider } from 'react-redux'
import Config from 'react-native-config'

import firebase from 'firebase'
  require("firebase/app");
  require("firebase/auth");
  require("firebase/database");

firebase.initializeApp({
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE_URL,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
});

const App = () => (
  <Provider store={store}>
    <HomeContainer />
  </Provider>
)

AppRegistry.registerComponent('inPhoodRN', () => App);
