import React, { Component } from 'react'
import {
  View,
  Platform,
  BackAndroid,
  NavigationExperimental
} from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import ScrollableTabView from 'react-native-scrollable-tab-view'

import Media from '../containers/MediaContainer'
import Home from '../containers/HomeContainer'
import Extras from '../containers/ExtrasContainer'

export default class App extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    if (Platform.OS === 'ios') {
      var {PushNotificationIOS} = require('react-native')
      PushNotificationIOS.requestPermissions()
    }
  }
  render () {
    console.disableYellowBox = true
    if (this.props.auth.result === null) {
      return <Extras />
    }
    return (
      <ScrollableTabView
        tabBarPosition="bottom"
        initialPage={0}
        renderTabBar={() => <View />}
      >
        <Media />
        <Home />
      </ScrollableTabView>
    )
  }
}