import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  Switch,
  Platform,
  TextInput,
  Picker,
  Dimensions,
  TouchableHighlight
} from 'react-native'

import Button from './Button'
import Spinner from 'react-native-loading-spinner-overlay'

var commonStyles = require('./styles/common-styles')

var { width, height } = Dimensions.get('window');

export default class Caption extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animating: false,
      size: this.props.gallery.photos.length,
      meal: false,
      recipe: false,
      breakfast: false,
      lunch: false,
      dinner: false,
      snack: false,
      caption: '',
      color: 'grey',
    }
  }
  _workBeforeTransition() {
    const {meal, recipe, breakfast, lunch, dinner, snack} = this.state
    // if (!meal && !recipe) {
    //   alert ('Please pick meal category')
    //   return
    // }
    let mealType = ''
    if (breakfast) {
      mealType = 'Breakfast'
    }
    else if (lunch) {
      mealType = 'Lunch'
    }
    else if (dinner) {
      mealType = 'Dinner'
    }
    else if (snack){
      mealType = 'Snack'
    }
    this.props._storeCaption(this.state.caption)
    if (!breakfast && !lunch && !dinner && !snack) {
      alert ('Please pick meal type')
      return
    }
    else {
      if (this.props._library) {
        this.props.addLibraryMealData(mealType)
        this.props.sendFirebaseInitLibrary()
        this.props._transmit()
      }
      else {
        this.props.addCameraMealData(mealType)
        this.props.sendFirebaseInitCamera()
        this.props._transmit()
      }
    }
  }
  _pauseBeforeTransition() {
    let whiteSpace = new RegExp(/^\s+$/)
    if (this.state.caption === '') {
      alert ('Please enter ingredients')
      return
    }
    else if (whiteSpace.test(this.state.caption)) {
      alert ('Please enter ingredients')
      return
    }
    this._workBeforeTransition()
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.gallery.photos.length > this.state.size) {
    //   this.props._transmit()
    // }
  }
  render() {
    let whiteSpace = new RegExp(/^\s+$/)

    // React native flex layout doesn't really seem to understand how to mix
    // flexDirection in a flex layout.  If you are going vertical and then nest
    // a horizontal child element, it sets the height to zero.  We can
    // workaround this by calculating the height we need for the layout.
    // In this particular case, it's based on the 20 segment layout:
    //
    //  imageHeight = (selectedImage->flex segments - fudge factor)
    //                * windowHeight / 20 segments
    //
    let imageHeight = (9 - 1) * Dimensions.get('window').height / 20;
    //
    // It also doesn't know how to size the imageWidth so we set that to 50%:
    //
    let imageWidth = Dimensions.get('window').width / 2;

    return (
      // This view divides the screen into 20 segments.  The bottom 8 segments
      // are left blank for the keyboard.  The top segment is left blank for
      // the device status bar.
      <View
        style={[commonStyles.flexContainer, commonStyles.flexCol]}>

        <View style={commonStyles.deviceStatusBarView}/>

        <View style={commonStyles.selectedImage}>
          {/* Workarounds for nested flex layout direction mixing with images
              abound in the view below: */}
          <View style={{height: imageHeight}, commonStyles.flexRow}>

            <View style={[commonStyles.flexCol, {flex: 1, height: imageHeight}]}>

              <View style={commonStyles.captionSwitchGroup}>
                <Switch
                  onValueChange={(value) => {
                    if (value) {
                      this.setState({
                        breakfast: value,
                        lunch: !value,
                        dinner: !value,
                        snack: !value,
                      })
                    } else {
                      this.setState({breakfast: value})
                    }
                  }}
                  value={this.state.breakfast} />

                  <Text style={commonStyles.universalSwitchFontSize}>
                    Breakfast
                  </Text>
              </View>

              <View style={commonStyles.captionSwitchGroup}>
                <Switch
                onValueChange={(value) => {
                  if (value) {
                    this.setState({
                      breakfast: !value,
                      lunch: value,
                      dinner: !value,
                      snack: !value,
                    })
                  }
                  else {
                    this.setState({lunch: value})
                  }
                }}
                value={this.state.lunch} />

                <Text style={commonStyles.universalSwitchFontSize}>
                  Lunch
                </Text>
              </View>

              <View style={commonStyles.captionSwitchGroup}>
                <Switch
                onValueChange={(value) => {
                  if (value) {
                    this.setState({
                      breakfast: !value,
                      lunch: !value,
                      dinner: value,
                      snack: !value,
                    })
                  }
                  else {
                    this.setState({dinner: value})
                  }
                }}
                value={this.state.dinner} />

                <Text style={commonStyles.universalSwitchFontSize}>
                  Dinner
                </Text>
              </View>

              <View style={commonStyles.captionSwitchGroup}>
                <Switch
                onValueChange={(value) => {
                  if (value) {
                    this.setState({
                      breakfast: !value,
                      lunch: !value,
                      dinner: !value,
                      snack: value,
                    })
                  }
                  else {
                    this.setState({snack: value})
                  }
                }}
                value={this.state.snack} />

                <Text style={commonStyles.universalSwitchFontSize}>
                  Snack
                </Text>
              </View>

            </View>

            <TouchableHighlight onPress={this.props._handleBackAction}>
              <Image
                style={[{height: imageHeight, width: imageWidth},
                        commonStyles.universalBorderRadius]}
                resizeMode='cover'
                source={{uri: this.props._selectedPhoto}}/>
            </TouchableHighlight>
          </View>

        </View>

        <View>
          <Spinner color='black' visible={this.state.animating} />
        </View>

        {/*Need this View wrapping TextInput to support single sided border
          text input line.*/}
        <View
          style={[commonStyles.singleSegmentView,
                  commonStyles.universalInputView,
                  commonStyles.universalMargin]}>
          <TextInput
            style={[commonStyles.singleSegmentView,
                    commonStyles.universalFontSize]}
            autoCapitalize="none"
            placeholder="Ingredients, e.g.: Beef, Tomatoes ..."
            returnKeyType="done"
            onEndEditing={
              (event) => {
                let text = event.nativeEvent.text
                if (text === '') {
                  this.setState({caption: '', color: 'grey'})
                  alert ('Please enter ingredients')
                }
                else if (whiteSpace.test(text)) {
                  this.setState({caption: '', color: 'grey'})
                  alert ('Please enter proper ingredients')
                }
                else {
                  this.setState({caption: text, color: '#006400'})
                }
              }
            }
          />
        </View>

        <Button
          onPress={this._pauseBeforeTransition.bind(this)}
          label='Send'
          color={this.state.color}
        />

        <View style={commonStyles.deviceKeyboardView}/>

      </View>
    )
  }
}
