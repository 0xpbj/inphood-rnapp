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
        tabBarUnderlineColor="black"
        tabBarActiveTextColor="black"
        tabBarPosition="bottom"
        locked={true}
      >
        <Library
          tabLabel="Library"
          baseHandleBackAction={this.props.baseHandleBackAction}
        />
        <Camera
          tabLabel="Camera"
          baseHandleBackAction={this.props.baseHandleBackAction}
        />
      </ScrollableTabView>
    )
  }
}
