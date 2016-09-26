import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Camera from 'react-native-camera'

import CommonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Meal Title'
  }
}

export default class Picture extends Component {
  constructor(props) {
    super(props);
  }
  takePicture() {
    this.camera.capture()
      .then((data) => {
        this.props._takePhoto(data)
        this.props._handleNavigate(route)
      })
      .catch(err => console.error(err));
  }
  render () {
    return (
      <View style={CommonStyles.flexContainer}>
        <Camera
          ref={(cam) => {
            this.camera = cam
          }}
          style={[CommonStyles.picturePreview,
                  {height: Dimensions.get('window').height,
                   width: Dimensions.get('window').width}]}>
          <View style={CommonStyles.shutterOuterViewStyle}>
            <TouchableHighlight style={CommonStyles.shutterInnerViewStyle} onPress={this.takePicture.bind(this)}>
              <View/>
            </TouchableHighlight>
          </View>
        </Camera>
      </View>
    );
  }
}
