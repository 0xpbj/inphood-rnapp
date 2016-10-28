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

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

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
  handleChangeTab({i, ref, from}) {
    this.props.changePage(i)
  }
  render () {
    console.disableYellowBox = true
    let locked = false
    if (this.props.tabs.index > 0 || this.props.gallery.index > 0 || this.props.media.index > 0) {
      locked = true
    }
    if (this.props.auth.result === null) {
      return <Extras />
    }
    return (
      <ScrollableTabView
        tabBarPosition="bottom"
        page={this.props.page.index}
        locked={locked}
        onChangeTab={this.handleChangeTab.bind(this)}
        prerenderingSiblingsNumber={1}
        renderTabBar={() => 
          <ScrollableTabBar 
            backgroundColor='black' 
            style={{height: 0}}
          />
        }
      >
        <Media />
        <Home />
      </ScrollableTabView>
    )
  }
}