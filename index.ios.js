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

const App = () => (
  <Provider store={store}>
    <HomeContainer />
  </Provider>
)

AppRegistry.registerComponent('inPhoodRN', () => App);
