import React, { Component } from "react"

import {View} from "react-native"

import Camera  from '../containers/CameraContainer'
import Library from '../containers/LibraryContainer'

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

export default class Media extends Component {
  constructor(props) {
    super(props);
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
        renderTabBar={() => <ScrollableTabBar
                              style={{height:horribleHack}} />}
      >
        <Camera
          tabLabel="Camera"
          changeTab={this.props.changeTab}
        />
        <Library
          tabLabel="Library"
          changeTab={this.props.changeTab}
        />
      </ScrollableTabView>
    )
  }
}
