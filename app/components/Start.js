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
  emptyView() {
    return(<View style={{flex: 1}}/>)
  }
  flipBoard() {
    return (
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <Swiper
          autoplay={true}>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f1.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f2.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f3.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f4.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode} style={sliderImageSize} source={require('./img/f5.png')}/>
          </View>
        </Swiper>
      </View>)
  }
  loginOutButton() {
    const buttonText =  this.props.auth.result ? 'Log Out' : 'Log In'
    return (
      <View style={{bottom: 130, alignItems: 'center'}}>
        <TouchableHighlight
          style={CommonStyles.button}
          underlayColor='#99d9f4'
          onPress={this._setModalVisible.bind(this,true)}>
          <Text style={CommonStyles.buttonText}>{buttonText}</Text>
        </TouchableHighlight>
      </View>)
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
