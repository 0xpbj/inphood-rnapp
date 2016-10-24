import React, { Component } from 'react'
import {
  AppRegistry,
  Dimensions,
  Platform,
  Text,
  TouchableHighlight,
  View,
  NativeModules,
} from 'react-native'

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
    super(props)
  }
  takePicture() {
    this.camera.capture()
      .then((data) => {
        if (Platform.OS === 'ios') {
          NativeModules.ReadImageData.readImage(data.path, (image) => this.props._store64Data(image))
        }
        else {  // Android
          // The default settings on react-native-camera for android is
          // captureTarget is Camera.constants.captureTarget.disk which defaults to
          // base64  (https://github.com/lwansbrough/react-native-camera)
          this.props._store64Data(data)
        }
        this.props._storePhoto(data.path)
        this.props._handleNavigate(route)
      })
      .catch(err => console.error(err))
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
            <TouchableHighlight
              style={CommonStyles.shutterInnerViewStyle}
              onPress={this.takePicture.bind(this)}>
              <View/>
            </TouchableHighlight>
          </View>
        </Camera>
      </View>
    )
  }
}
