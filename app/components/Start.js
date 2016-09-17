/* @flow */

'use strict'

import React, { Component } from "react"
import {
  View,
  Text,
  Image,
  Modal,
  Platform,
  StyleSheet,
  ScrollView,
  NativeModules,
  TouchableHighlight,
} from "react-native"

import SwipeALot from 'react-native-swipe-a-lot'
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
    const buttonColor = this.props.auth.result ? '#006400' : 'white'
    const Button = this.props.auth.result ? <Text style={CommonStyles.buttonText}>Log Out</Text> : <Text style={CommonStyles.buttonText}>Log In</Text>
    const Swiper = this.props.auth.result ? <View style={{flex: 2, backgroundColor: 'transparent'}}></View> : (
      <View style={{flex: 2, backgroundColor: 'transparent'}}>
        <SwipeALot autoplay={{enabled: true, disableOnSwipe: false, delayBetweenAutoSwipes: 5000}}>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode='contain' style={{height:368, width:414}} source={require('./img/f1.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode='contain' style={{height:368, width:414}} source={require('./img/f2.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode='contain' style={{height:368, width:414}} source={require('./img/f3.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode='contain' style={{height:368, width:414}} source={require('./img/f4.png')}/>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode='contain' style={{height:368, width:414}} source={require('./img/f5.png')}/>
          </View>
        </SwipeALot>
      </View>
    )
    if (this.props.auth.result === null) {
      if (this.state.login) {
        return (
          <Image source={require('./img/HD_5_5.png')} style={CommonStyles.containerImage}>
            <View style={{flex: 1, backgroundColor: 'transparent'}}/>
           {/*
            // TODO:
            //    1. Need to resolve height and width properly for the different phone platforms. The numbers below are
            //       for iPhone 6s+.  They look ok on iPhone 6s, but are obviously wrong on iPhone 4SE.
            //    2. Need to update images here--these are placeholders.
            //    3. Consider disabling thise widget entirely when a user has logged in?
            //          - not MVP
            //          - also what's the value of disabling it?
            //          - entertain idea of displaying other tips / tricks for inPhood here
            //
           */}
            {Swiper}
            <View style={{flex: 1, top: 10, alignItems: 'center'}}>
              <TouchableHighlight
                style={CommonStyles.button}
                underlayColor='#99d9f4'
                onPress={this._setModalVisible.bind(this, true)}
              >
                {Button}
              </TouchableHighlight>
            </View>
            <Modal
              animationType='none'
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {this._setModalVisible(false)}}
              >
              <View style={CommonStyles.modalContainer}>
                <View style={[CommonStyles.innerContainer, {backgroundColor: '#fff', padding: 10}]}>
                  <FacebookLogin
                    auth={this.props.auth}
                    storeResult={this.props.storeResult}
                    storeError={this.props.storeError}
                    loginRequest={this.props.loginRequest}
                    logoutRequest={this.props.logoutRequest}
                    loginError={this.props.loginError}
                    storeToken={this.props.storeToken}
                    _setModalVisible={this._setModalVisible.bind(this)}
                  />
                  <TouchableHighlight
                    style={[CommonStyles.button, CommonStyles.modalButton]}
                    underlayColor='#99d9f4'
                    onPress={this._emailLogin.bind(this)}
                  >
                    <Text style={CommonStyles.buttonText}>Log in with Email</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={this._setModalVisible.bind(this, false)}
                    style={[CommonStyles.button, CommonStyles.modalButton]}
                  >
                    <Text style={[CommonStyles.buttonText]}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </Image>
        )
      }
      else {
        return (
          <Image source={require('./img/HD_5_5.png')} style={CommonStyles.containerImage}>
            <Spinner
              visible={true}
              color='white'
            />
          </Image>
        )
      }
    }
    else {
      const uri = this.props.auth.result.picture
      const logoutButton = this.props.auth.result.provider === "facebook.com"
      ? (
          <View style={{marginTop: 10}}>
            <FacebookLogin
              auth={this.props.auth}
              storeResult={this.props.storeResult}
              storeError={this.props.storeError}
              loginRequest={this.props.loginRequest}
              logoutRequest={this.props.logoutRequest}
              loginError={this.props.loginError}
              storeToken={this.props.storeToken}
              _setModalVisible={this._setModalVisible.bind(this)}
            />
          </View>
        )
      : (
          <TouchableHighlight
            style={CommonStyles.button}
            underlayColor='#99d9f4'
            onPress={this._emailLogout.bind(this)}
          >
            <View style={{flexDirection: 'row'}}>
              <Icon name="ios-exit-outline" size={26} color='white' style={{marginLeft: 10, marginRight: 30}}/>
              <Text style={CommonStyles.buttonText}>Email Log Out</Text>
            </View>
          </TouchableHighlight>
        )
      return (
        <View style={CommonStyles.container}>
          <TouchableHighlight
            onPress={this.userProfile.bind(this)}>
            <Image
              source={{uri: uri}}
              style={[CommonStyles.profileImage, {borderColor: buttonColor}]}
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.sendEmail.bind(this)}
            style={[CommonStyles.button, CommonStyles.modalButton]}
          >
            <View style={{flexDirection: 'row'}}>
              <Icon name="ios-mail-outline" size={26} color='white' style={{marginLeft: 10, marginRight: 25}}/>
              <Text style={CommonStyles.buttonText}>Help Email</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.userSettings.bind(this)}
            style={[CommonStyles.button, CommonStyles.modalButton]}
          >
            <View style={{flexDirection: 'row'}}>
              <Icon name="ios-settings-outline" size={26} color='white' style={{marginLeft: 10, marginRight: 15}}/>
              <Text style={CommonStyles.buttonText}>User Settings</Text>
            </View>
          </TouchableHighlight>
          {logoutButton}
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
}
