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

import CommonStyles from './styles/common-styles'

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

    return (

      // This view divides the screen into 20 segments.  The bottom 8 segments
      // are left blank for the keyboard.  The top segment is left blank for
      // the device status bar.
      <View style={CommonStyles.flexContainer}>

        <View style={CommonStyles.deviceStatusBarView}/>

        <TouchableHighlight
          onPress={this.props._handleBackAction}
          style={[CommonStyles.selectedImage,
                  CommonStyles.universalMargin]}>
          <Image
            style={[{flex:1},
                    CommonStyles.universalBorderRadius]}
            source={{uri: this.props._selectedPhoto}}/>
        </TouchableHighlight>

        {/* TODO: Ask PBJ what this is all about here?
          */}
        <View>
          <Spinner color='black' visible={this.state.animating} />
        </View>

        {/*Need this View wrapping TextInput to support single sided border
          text input line.*/}
        <View
          style={[CommonStyles.singleSegmentView,
                  CommonStyles.universalInputView,
                  CommonStyles.universalMargin]}>
          <TextInput
            style={[CommonStyles.singleSegmentView,
                    CommonStyles.universalFontSize]}
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

        <View style={[CommonStyles.deviceKeyboardView,
                     {marginTop: 5}]}>

          <View style={CommonStyles.captionSwitchGroup}>
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

              <Text style={CommonStyles.universalSwitchFontSize}>
                Breakfast
              </Text>
          </View>

          <View style={CommonStyles.captionSwitchGroup}>
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

            <Text style={CommonStyles.universalSwitchFontSize}>
              Lunch
            </Text>
          </View>

          <View style={CommonStyles.captionSwitchGroup}>
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

            <Text style={CommonStyles.universalSwitchFontSize}>
              Dinner
            </Text>
          </View>

          <View style={CommonStyles.captionSwitchGroup}>
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

            <Text style={CommonStyles.universalSwitchFontSize}>
              Snack
            </Text>
          </View>
        </View>

      </View>
    )
  }
}
