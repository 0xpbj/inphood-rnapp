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
  goHome() {
    this.props._changePage(1)
  }
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
      this.props._storePhoto(data.path)
      if (Platform.OS === 'ios') {
        NativeModules.ReadImageData.readImage(data.path, (image) => this.props._store64Data(image))
      }
      else {
        this.props._store64Data('')
      }
      this.props._handleNavigate(route)
    })
    .catch(err => console.error(err))
  }
  render () {
    return (
      <View style={CommonStyles.flexContainer}>
        <Camera
          captureAudio={false}
          ref={(cam) => {this.camera = cam}}
          style={[CommonStyles.picturePreview,
                  {height: Dimensions.get('window').height,
                   width: Dimensions.get('window').width}]}>

          <View style={{flex: 1}}/>

          <View style={{flexDirection: 'row',
                        justifyContent: 'center'}}>

            <View style={{flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center'}}>
              <TouchableOpacity
                style={CommonStyles.libraryViewButton}
                onPress={this.selectImage.bind(this)}>
                <Icon name="ios-images-outline" size={60} color='green'/>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}/>

            <View style={{flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center'}}>
              <TouchableOpacity
                style={CommonStyles.shutterOuterViewStyle}
                onPress={this.takePicture.bind(this)}>
                <View/>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}/>

            <View style={{flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'center'}}>
              <TouchableOpacity
                style={CommonStyles.homeViewButton}
                onPress={this.goHome.bind(this)}>

                <Icon name="ios-arrow-forward-outline"
                      size={60} color='green'/>
              </TouchableOpacity>
            </View>

          </View>

        </Camera>
      </View>
    )
  }
}
