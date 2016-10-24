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
    this.state = {
      title: '',
      color: 'grey',
    }
  }
  _workBeforeTransition() {
    this.props.storeTitle(this.state.title)
    this.props._handleNavigate(this.props._nextRoute)
  }
  _pauseBeforeTransition() {
    let whiteSpace = new RegExp(/^\s+$/)
    if (this.state.title === '') {
      alert ('Please enter a meal title')
      return
    }
    else if (whiteSpace.test(this.state.title)) {
      alert ('Please enter a proper meal title')
      return
    }
    // this.setState({color: '#22a3ed'})
    this._workBeforeTransition()
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
            onEndEditing={
              (event) => {
                let text = event.nativeEvent.text
                let whiteSpace = new RegExp(/^\s+$/)
                if (text === '') {
                  this.setState({title: '', color: 'grey'})
                  alert ('Please enter a meal title')
                }
                else if (whiteSpace.test(text)) {
                  this.setState({title: '', color: 'grey'})
                  alert ('Please enter a proper meal title')
                }
                else {
                  this.setState({title: text, color: '#006400'})
                }
              }
            }
          />
        </View>

        <Button
          onPress={this._pauseBeforeTransition.bind(this)}
          label='Next'
          color={this.state.color}/>

        <View style={CommonStyles.deviceKeyboardView}/>

      </View>
    )
  }
}
