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

{/*firebase.initializeapp({
  apikey: config.firebase_api_key,
  authdomain: config.firebase_auth_domain,
  databaseurl: config.firebase_database_url,
  storagebucket: config.firebase_storage_bucket,
});*/}

// firebase.initializeapp({
//   apikey: 'AIzaSyCDzrz6xKXMUqsirFLVyzXKQDR7zOlkZTA',
//   authdomain: 'shining-torch-3197.firebaseapp.com',
//   databaseurl: 'https://shining-torch-3197.firebaseio.com',
//   storagebucket: 'shining-torch-3197.appspot.com',
// });

const App = () => (
  <Provider store={store}>
    <HomeContainer />
  </Provider>
)

AppRegistry.registerComponent('inPhoodRN', () => App);
