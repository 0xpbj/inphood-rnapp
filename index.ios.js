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

import AppContainer from './app/containers/AppContainer'
import { Provider } from 'react-redux'

const App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
)

AppRegistry.registerComponent('inPhoodRN', () => App);
