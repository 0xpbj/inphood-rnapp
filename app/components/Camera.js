import React, { Component } from "react"

import {View} from "react-native"

import Picture  from './Picture'
import Photos  from './Photos'

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view'

export default class Camera extends Component {
  constructor(props) {
    super(props)
    this.gotoCameraPage = this.gotoCameraPage.bind(this)
  }
  gotoCameraPage() {
    this.refs.scrollableTabView.goToPage(0)
  }
  render() {
    // TODO: fix this properly
    // hack sets the height of the tab bar to zero to prevent it from rendering
    const horribleHack = 0

    return (
      <ScrollableTabView
        tabBarUnderlineColor="#006400"
        tabBarActiveTextColor="#006400"
        tabBarPosition="bottom"
        ref="scrollableTabView"
        renderTabBar={() => <ScrollableTabBar
                              style={{height:horribleHack}} />}
      >
        <Picture
          tabLabel="Picture"
          changeTab={this.props.changeTab}
          _storePhoto={this.props._storePhoto}
          _store64Data={this.props._store64Data}
          _handleNavigate={this.props._handleNavigate}
        />
        <Photos
          tabLabel="Photos"
          changeTab={this.props.changeTab}
          _gotoCameraPage={this.gotoCameraPage}
          _storePhoto={this.props._storePhoto}
          _store64Data={this.props._store64Data}
          _handleNavigate={this.props._handleNavigate}
        />
      </ScrollableTabView>
    )
  }
}
