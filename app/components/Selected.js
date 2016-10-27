'use strict'

import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  Picker,
  TouchableHighlight
} from 'react-native'
import Button from './Button'

import CommonStyles from './styles/common-styles'

export default class Selected extends Component {
  constructor(props) {
    super(props)
    this._workBeforeTransition = this._workBeforeTransition.bind(this)
  }
  _workBeforeTransition(text) {
    this.props.storeTitle(text)
    this.props._handleNavigate(this.props._nextRoute)
  }
  render() {
    return (
      // This view divides the screen into 17 segments.  The bottom 8 segments
      // are left blank for the keyboard.
      <View style={CommonStyles.flexContainer}>
        <Image
          style={[CommonStyles.selectedImage,
                  CommonStyles.universalBorderRadius,
                  CommonStyles.universalMargin]}
          resizeMode='cover'
          source={{uri: this.props.selected.photo}}/>

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
            placeholder="Meal title, e.g.: Spaghetti & Meatballs ..."
            returnKeyType="done"
            clearButtonMode='while-editing'
            autoFocus={true}
            onSubmitEditing={
              (event) => {
                let text = event.nativeEvent.text
                let whiteSpace = new RegExp(/^\s+$/)
                if (text === '') {
                  alert ('Please enter a meal title')
                }
                else if (whiteSpace.test(text)) {
                  alert ('Please enter a proper meal title')
                }
                else {
                  this._workBeforeTransition(text)
                }
              }
            }
          />
        </View>
        <View style={CommonStyles.deviceKeyboardView}/>
      </View>
    )
  }
}
