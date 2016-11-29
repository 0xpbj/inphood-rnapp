'use strict'

import React, {Component} from 'react'
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  Platform,
  Picker,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native'
import Button from './Button'

import CommonStyles from './styles/common-styles'

export default class Selected extends Component {
  constructor(props) {
    super(props)
    this._workBeforeTransition = this._workBeforeTransition.bind(this)
  }
  _workBeforeTransition(text) {
    if (this.props.info.referralSetup === 'pending' && this.props.info.referralType === 'client') {
      Alert.alert(
       'Share data with your trainer: ' + this.props.info.referralName + '?',
       '',
       [
          {text: 'Decline',
          onPress: () => {
            this.props.setBranchAuthSetup('decline')
            this.props.storeTitle(text)
            this.props._handleNavigate(this.props._nextRoute)
          }, style: 'destructive'},
          {text: 'Accept',
          onPress: () => {
            this.props.setBranchAuthSetup('accept')
            this.props.storeTitle(text)
            this.props._handleNavigate(this.props._nextRoute)
          }, style: 'default'}
       ],
      )
    }
    else {
      this.props.storeTitle(text)
      this.props._handleNavigate(this.props._nextRoute)
    }
  }
  _renderImage() {
    return (
      <Image
        style={[CommonStyles.selectedImage,
                CommonStyles.universalBorderRadius,
                CommonStyles.universalMargin]}
        resizeMode='cover'
        source={{uri: this.props.selected.photo}}/>
    )
  }
  _renderTextInput(textInputAutoFocus) {
    return(
      <TextInput
        style={[CommonStyles.singleSegmentView,
                CommonStyles.universalFontSize]}
        autoCapitalize="none"
        placeholder="Meal title, e.g.: Spaghetti & Meatballs ..."
        returnKeyType="done"
        clearButtonMode='while-editing'
        autoFocus={textInputAutoFocus}
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
    )
  }
  _renderIOS() {
    return (
      // This view divides the screen into 17 segments.  The bottom 8 segments
      // are left blank for the keyboard.
      <KeyboardAvoidingView behavior='padding' style={CommonStyles.flexContainer}>
        {this._renderImage()}

        {/*Need this View wrapping TextInput to support single sided border
          text input line.*/}
        <KeyboardAvoidingView behavior='padding'
          style={[CommonStyles.singleSegmentView,
                  CommonStyles.universalInputView,
                  CommonStyles.universalMargin]}>
          {this._renderTextInput(true)}
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
    )
  }
  _renderAndroid() {
    return(
      // This view divides the screen into 17 segments.  The bottom 8 segments
      // are left blank for the keyboard.
      <View style={CommonStyles.flexContainer}>
        {this._renderImage()}

        {/*Need this View wrapping TextInput to support single sided border
          text input line.*/}
        <View
          style={[CommonStyles.singleSegmentView,
                  CommonStyles.universalInputView,
                  CommonStyles.universalMargin]}>
          {this._renderTextInput(false)}
        </View>
      </View>
    )
  }
  render() {
    // The keyboard behavior of iOS and Android are very different. If we use
    // keyboardAvoidingViews with Android we get flicker and the default behavior
    // of Android is similar to this anyway, so we've created two different rendering
    // paths based on iOS.

    // TODO: This is really a hack/workaround for 1.5 Android, but there are a number of
    //       problems:
    //         - Android's keyboard doesn't lose focus when you click on the picture
    //           which is used to cause the keyboard to drop down and the picture
    //           to become larger.
    //         - There are nested KeyboardAvoidingViews below--not sure if this is
    //           recommended or causes flicker. A fix is not straightforward either
    //           as there are issues with the text bar disappearing etc.
    //       When time permits this needs to be restyled.
    return (Platform.OS === 'ios' ? this._renderIOS() : this._renderAndroid())
  }
}
