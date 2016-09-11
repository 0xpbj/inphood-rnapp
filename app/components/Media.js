import React, { Component } from "react"

import Camera  from '../containers/CameraContainer'
import Library from '../containers/LibraryContainer'

import ScrollableTabView from 'react-native-scrollable-tab-view'

export default class Media extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ScrollableTabView
        tabBarUnderlineColor="#006400"
        tabBarActiveTextColor="#006400"
        tabBarPosition="bottom"
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
