import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Camera from 'react-native-camera'

var commonStyles = require('./styles/common-styles')

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
    this.camera.capture((err, data) => {
      if (err) {
        console.log ('Camera Error')
      }
      else {
        this.props._takePhoto(data)
        this.props._handleNavigate(route)
      }
    })
  }
  render () {
    return (
      <View style={commonStyles.flexContainer}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={[commonStyles.picturePreview,
                  {height: Dimensions.get('window').height,
                   width: Dimensions.get('window').width}]}
          aspect={Camera.constants.Aspect.fill}>
          <View style={commonStyles.shutterOuterViewStyle}>
            <TouchableHighlight style={commonStyles.shutterInnerViewStyle} onPress={this.takePicture.bind(this)}>
              <View/>
            </TouchableHighlight>
          </View>
        </Camera>
      </View>
    );
  }
}
