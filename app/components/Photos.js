import React, {Component} from 'react'
import {
  Image,
  Platform,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ListView,
  NativeModules,
  ActivityIndicator,
} from 'react-native'

import ImagePicker from 'react-native-image-picker'

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Meal Title'
  }
}
export default class Photos extends Component {
  render() {
    if (Platform.OS === "ios") {
      var {width} = Dimensions.get('window')
      var {imageMargin, imagesPerRow, containerWidth} = this.props
      if(typeof containerWidth != "undefined") {
        width = containerWidth
      }
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow
    var options = { title: '' }
    return (
      <View style={{flex: 1}}>{
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.didCancel)
            this.props._gotoCameraPage()
          else if (response.data) {
            this._selectImage(response)
          }
      })}
      </View>
    )
  }
  _selectImage(response) {
    this.props._gotoCameraPage()
    this.props._store64Data(response.data)
    if (Platform.OS === "ios")
      this.props._storePhoto(response.origURL)
    else
      this.props._storePhoto(response.uri)
    this.props._handleNavigate(route)
  }
}