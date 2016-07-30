import React, { Component } from "react";

import Camera  from '../containers/CameraContainer'
import Library from '../containers/LibraryContainer'

import ScrollableTabView from 'react-native-scrollable-tab-view'

export default class Media extends Component {
  render() {
    return (
      <ScrollableTabView
        tabBarUnderlineColor="black"
        tabBarActiveTextColor="black"
        tabBarPosition="bottom"
        style={{paddingBottom: 48}}
      >
        <Camera tabLabel="Camera" />
        <Library tabLabel="Library" />
      </ScrollableTabView>
    )
  }
}
