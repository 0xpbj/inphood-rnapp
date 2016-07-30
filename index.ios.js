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

import BaseContainer from './app/containers/BaseContainer'
import { Provider } from 'react-redux'

import firebase from 'firebase'
  require("firebase/app");
  require("firebase/auth");
  require("firebase/database");

firebase.initializeApp({
  apiKey: "AIzaSyCDzrz6xKXMUqsirFLVyzXKQDR7zOlkZTA",
  authDomain: "shining-torch-3197.firebaseapp.com",
  databaseURL: "https://shining-torch-3197.firebaseio.com",
  storageBucket: "shining-torch-3197.appspot.com",
});

const App = () => (
  <Provider store={store}>
    <BaseContainer />
  </Provider>
)

AppRegistry.registerComponent('inPhoodRN', () => App);
