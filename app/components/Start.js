/* @flow */

'use strict'

import React, { Component } from "react"
import {
  View,
  Text,
  Image,
  Modal,
  Platform,
  Dimensions,
  StyleSheet,
  ScrollView,
  NativeModules,
  TouchableHighlight,
} from "react-native"

import Swiper from 'react-native-swiper'

import Icon from 'react-native-vector-icons/Ionicons'
import TimerMixin from 'react-timer-mixin'
import FacebookLogin from './FacebookLogin'
import EmailLogin from './EmailLogin'
import Spinner from 'react-native-loading-spinner-overlay'
import Device from 'react-native-device'
var Mailer = require('NativeModules').RNMail

import CommonStyles from './styles/common-styles'

const loginRoute = {
  type: 'push',
  route: {
    key: 'login',
    title: 'Email Login'
  }
}

const profileRoute = {
  type: 'push',
  route: {
    key: 'profile',
    title: 'User Profile'
  }
}

const settingsRoute = {
  type: 'push',
  route: {
    key: 'settings',
    title: 'User Settings'
  }
}

const windowSize = Dimensions.get('window')
const launchImageSize = {width: windowSize.width, height: windowSize.height}
const sliderImageSize = {width: windowSize.width, height: windowSize.height}
const sliderImageResizeMode = 'stretch'

export default class Start extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: null,
      height: null,
      modalVisible: false,
      login: false
    }
  }
  mixins: [TimerMixin]
  componentDidMount() {
    setTimeout(
      () => {
        this.setState({
          login: true,
        })
      },
      5000
    )
  }
  userProfile() {
    this.props._handleNavigate(profileRoute)
  }
  userSettings() {
    this.props._handleNavigate(settingsRoute)
  }
  sendEmail() {
    if (this.props.auth.result !== null && (Platform.OS === 'ios')) {
      let deviceInfo = '\n\n\n\n\nDevice Type: ' + Device.deviceName + '\nOS Information: ' + Device.systemName + ' ' + Device.systemVersion
      Mailer.mail({
        subject: 'Need Help',
        recipients: ['support@inphood.com'],
        body: deviceInfo,
        // isHTML: true, // iOS only, exclude if false
      }, (error, event) => {
          if(error) {
            alert('Could not send mail. Please send a mail to support@inphood.com');
          }
      })
    }
  }
  render() {
    if (this.props.auth.result === null) {
      if (this.state.login) {
        return (
          <View style={{flex: 1}}>
            {this.flipBoard()}
            {this.loginOutButton()}
            {this.modalLoginOutDialog()}
          </View>
        )
      } else {
        return (this.launchScreen())
      }
    } else {
      return (
        <View style={CommonStyles.container}>
          {this.profileImageButton()}
          {this.helpEmailButton()}
          {this.userSettingsButton()}
          {this.logOutButton()}
        </View>
      )
    }
  }
  _emailLogin() {
    this._setModalVisible(false)
    this.props._handleNavigate(loginRoute)
  }
  _emailLogout() {
    this.props.logoutRequest()
  }
  _setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
  launchScreen() {
    return (
      <Image
        source={require('./img/HD_5_5.png')}
        style={[launchImageSize, CommonStyles.containerImage]}>
        <Spinner
          visible={true}
          color='white'/>
      </Image>
    )
  }
  flipBoardCaption(captionLocation, captionText) {
    const onePercentWidth = windowSize.width / 100
    const onePercentHeight = windowSize.height / 100
    const captionWidth = 60 * onePercentWidth
    const captionHeight = 20 * onePercentHeight
    const resolvedCaptionLocation = {top: captionLocation.top * onePercentHeight,
                                     left: captionLocation.left * onePercentWidth}
    const darkGoldenRodTransluscent = 'rgba(184, 134, 11, 0.90)'

    // TODO: Algorithm to scale the font based on screen size / pixel density
    // (Presently if the screen is longer, the font won't fill the caption as
    // far down and the caption bottom may not intersect items of interest.)

    return(
      <View
        style={[{width: captionWidth,
                backgroundColor: darkGoldenRodTransluscent,
                padding: 10,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 8,},
                resolvedCaptionLocation]}>
        <Text
          style={{fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white'}}>
          {captionText}</Text>
      </View>
    )
  }
  flipBoard() {
    const pageOneCaptionLocation = {top: 60, left: 30}
    const pageOneCaptionText = '1. Take a photo of a meal.'
    const pageTwoCaptionLocation = {top: 45, left: 30}
    const pageTwoCaptionText = '2. Give it a title.'
    const pageThreeCaptionLocation = {top: 65, left: 35}
    const pageThreeCaptionText = '3. Describe it\'s ingredients.'
    const pageFourCaptionLocation = {top: 45, left: 35}
    const pageFourCaptionText = '4. Your trainer sees the photo & description.'
    const pageFiveCaptionLocation = {top: 20, left: 10}
    const pageFiveCaptionText = '5. Discuss the meal with your trainer.'

    return (
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <Swiper
          autoplay={true}>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f1.png')}>
            {this.flipBoardCaption(pageOneCaptionLocation, pageOneCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f2.png')}>
            {this.flipBoardCaption(pageTwoCaptionLocation, pageTwoCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f3.png')}>
            {this.flipBoardCaption(pageThreeCaptionLocation, pageThreeCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f4.png')}>
            {this.flipBoardCaption(pageFourCaptionLocation, pageFourCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f5.png')}>
            {this.flipBoardCaption(pageFiveCaptionLocation, pageFiveCaptionText)}
            </Image>
          </View>
        </Swiper>
      </View>
    )
  }
  loginOutButton() {
    const buttonText =  this.props.auth.result ? 'Log Out' : 'Log In'
    const offsetFromBottom = windowSize.height / 10
    return (
      <View style={{alignItems: 'center'}}>
        <View style={{bottom: offsetFromBottom,
                      width: 200,
                      backgroundColor: 'rgba(127, 127, 127, 0.4)',
                      alignItems: 'center',
                      paddingRight: 10,
                      paddingLeft: 10,
                      borderRadius: 4,}}>
          <TouchableHighlight
            style={CommonStyles.button}
            underlayColor='#99d9f4'
            onPress={this._setModalVisible.bind(this,true)}>
            <Text style={CommonStyles.buttonText}>{buttonText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  modalFacebookLoginButton() {
    return (
      <FacebookLogin
        auth={this.props.auth}
        storeResult={this.props.storeResult}
        storeError={this.props.storeError}
        loginRequest={this.props.loginRequest}
        logoutRequest={this.props.logoutRequest}
        loginError={this.props.loginError}
        storeToken={this.props.storeToken}
        _setModalVisible={this._setModalVisible.bind(this)}/>
    )
  }
  modalEmailLoginButton() {
    return (
      <TouchableHighlight
        style={CommonStyles.button}
        underlayColor='#99d9f4'
        onPress={this._emailLogin.bind(this)}>
        <Text style={CommonStyles.buttonText}>Log in with Email</Text>
      </TouchableHighlight>
    )
  }
  modalCancelLoginButton() {
    return (
      <TouchableHighlight
        onPress={this._setModalVisible.bind(this, false)}
        style={CommonStyles.button}>
        <Text style={CommonStyles.buttonText}>Cancel</Text>
      </TouchableHighlight>
    )
  }
  modalLoginOutDialog() {
    return (
      <Modal
        animationType='none'
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {this._setModalVisible(false)}}>
        <View style={CommonStyles.modalContainer}>
          <View style={[{backgroundColor: '#fff', padding: 10},
                        CommonStyles.innerContainer]}>
            {this.modalFacebookLoginButton()}
            {this.modalEmailLoginButton()}
            {this.modalCancelLoginButton()}
          </View>
        </View>
      </Modal>
    )
  }
  logOutButton() {
    if (this.props.auth.result.provider === "facebook.com") {
      return (
        <View style={{marginTop: 10}}>{this.modalFacebookLoginButton()}</View>)
    } else {
      return (
        <TouchableHighlight
          style={CommonStyles.button}
          underlayColor='#99d9f4'
          onPress={this._emailLogout.bind(this)}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="ios-exit-outline"
              size={26} color='white'
              style={{marginLeft: 10, marginRight: 30}}/>
            <Text style={CommonStyles.buttonText}>Email Log Out</Text>
          </View>
        </TouchableHighlight>)
    }
  }
  profileImageButton() {
    const uri = this.props.auth.result.picture
    const buttonColor = this.props.auth.result ? '#006400' : 'white'
    return (
      <TouchableHighlight
        onPress={this.userProfile.bind(this)}>
        <Image
          source={{uri: uri}}
          style={[CommonStyles.profileImage, {borderColor: buttonColor}]}/>
      </TouchableHighlight>
    )
  }
  helpEmailButton() {
    return (
      <TouchableHighlight
        onPress={this.sendEmail.bind(this)}
        style={[CommonStyles.button, CommonStyles.modalButton]}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="ios-mail-outline"
            size={26} color='white'
            style={{marginLeft: 10, marginRight: 25}}/>
          <Text style={CommonStyles.buttonText}>Help Email</Text>
        </View>
      </TouchableHighlight>
    )
  }
  userSettingsButton() {
    return (
      <TouchableHighlight
        onPress={this.userSettings.bind(this)}
        style={[CommonStyles.button, CommonStyles.modalButton]}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="ios-settings-outline"
            size={26} color='white'
            style={{marginLeft: 10, marginRight: 15}}/>
          <Text style={CommonStyles.buttonText}>User Settings</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
