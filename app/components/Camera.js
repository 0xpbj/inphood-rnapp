import React, { Component } from 'react'
import {
  View,
  Text,
  Platform,
  Dimensions,
  AppRegistry,
  NativeModules,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native'

import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-picker'

import CommonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Meal Title'
  }
}

export default class AppCamera extends Component {
  selectImage() {
    if (Platform.OS === "ios") {
      var {width} = Dimensions.get('window')
      var {imageMargin, imagesPerRow, containerWidth} = this.props
      if(typeof containerWidth != "undefined") {
        width = containerWidth
      }
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow
    var options = {
      title: '',
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      takePhotoButtonTitle: null,
    }
    ImagePicker.showImagePicker(options, (response) => {
      if (response.data) {
        this.props._store64Data(response.data)
        if (Platform.OS === "ios")
          this.props._storePhoto(response.origURL)
        else
          this.props._storePhoto(response.uri)
        this.props._handleNavigate(route)
      }
    })
  }
  takePicture() {
    this.camera.capture()
      .then((data) => {
        if (Platform.OS === 'ios') {
          NativeModules.ReadImageData.readImage(data.path, (image) => this.props._store64Data(image))
        }
        else {  // Android
          // The next line doesn't work ...
          // None of the settings (disk or memory) for captureTarget in
          // react-native-camera seem to be returning 64 bit data--there's just
          // a path so we need to find a fast way to read the image b64 data to
          // send to clarifai; the read should be of a smaller / compressed image
          // if possible (for speed):
          // (https://github.com/lwansbrough/react-native-camera)
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
          <TouchableOpacity
            style={CommonStyles.homeView}
            onPress={() => this.props.changeTab(1)}
          >
            <Icon name="ios-arrow-forward-outline" size={60} color='green'/>
          </TouchableOpacity>
          <View style={CommonStyles.shutterOuterViewStyle}>
            <TouchableHighlight
              style={CommonStyles.shutterInnerViewStyle}
              onPress={this.takePicture.bind(this)}>
              <View/>
            </TouchableHighlight>
          </View>
          <TouchableOpacity
            style={CommonStyles.libraryView}
            onPress={this.selectImage.bind(this)}>
            <Icon name="ios-images-outline" size={60} color='green'/>
          </TouchableOpacity>
        </Camera>
      </View>
    )
  }
}
