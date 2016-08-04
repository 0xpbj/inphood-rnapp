import React, { Component } from "react";

import Camera  from './Camera'
import Library from './Library'

import ScrollableTabView from 'react-native-scrollable-tab-view'

export default class Media extends Component {
  constructor(props) {
    super(props);
  }
  onChangeTab(i, ref, from) {
    if (i.i === 0 && i.from === 1) {
      // console.log('Switched from Camera to Library')
      // while (this.props.lnavigation.index > 0) {
      //   console.log(this.props.lnavigation)
      //   this.props.lnavigation.bind(this.props.pop())
      // }
    }
    else if (i.i === 1 && i.from === 0) {
      // console.log('Switched from Library to Camera')
      // while (this.props.cnavigation.index > 0) {
      //   console.log(this.props.cnavigation)
      //   this.props.cnavigation.bind(this.props.pop())
      // }
    }
  }
  render() {
    return (
      <ScrollableTabView
        tabBarUnderlineColor="black"
        tabBarActiveTextColor="black"
        tabBarPosition="bottom"
        style={{paddingBottom: 50}}
        locked={true}
        onChangeTab={this.onChangeTab.bind(this)}
      >
        <Library
          tabLabel="Library"
          changeTab={this.props.changeTab}
          navigation={this.props.lnavigation}
          library={this.props.library}
          loadPhotosInit={this.props.loadPhotosInit}
          selectPhoto={this.props.selectPhoto}
          storeLibraryCaption={this.props.storeLibraryCaption}
          sendAWSInitLibrary={this.props.sendAWSInitLibrary}
          push={this.props.pushLib}
          pop={this.props.popLib}
        />
        <Camera
          tabLabel="Camera"
          changeTab={this.props.changeTab}
          navigation={this.props.cnavigation}
          camera={this.props.camera}
          takePhoto={this.props.takePhoto}
          storeCameraCaption={this.props.storeCameraCaption}
          sendAWSInitCamera={this.props.sendAWSInitCamera}
          push={this.props.pushCam}
          pop={this.props.popCam}
        />
      </ScrollableTabView>
    )
  }
}
