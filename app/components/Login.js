/* @flow */
{/*
'use strict'

import React, { Component } from "react"
import { 
  View, 
  Text, 
  Image, 
  Platform,
  StyleSheet, 
  ScrollView, 
  NativeModules, 
  TouchableHighlight,
} from "react-native"
import SwipeALot from 'react-native-swipe-a-lot'

import Icon from 'react-native-vector-icons/Ionicons'
import Device from 'react-native-device'
var Mailer = require('NativeModules').RNMail

import FacebookLogin from './facebookLogin'
import EmailLogin from './EmailLogin'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { width: null, height: null }
  }
  userProfile() {
    if (this.props.auth.result !== null) {
      alert('In progress: User profile page')
    }
  }
  userSettings() {
    if (this.props.auth.result !== null) {
      alert('In progress: User setting page')
    }
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
    let uri = this.state.result ? this.state.result.picture : ' '
    let buttonColor = this.props.auth.result ? '#006400' : 'white'
    return (
      <Image source={require('./img/HD_5_5.png')} style={styles.containerImage}>
        <View style={{flex: 0.25, backgroundColor: 'transparent'}}/>
        <View style={{flex: 1, backgroundColor: 'transparent'}}/>
        <View style={{flex: 1, backgroundColor: 'transparent'}}/>
        <View style={{flex: 1, top: 10, alignItems: 'center'}}>
          <TouchableHighlight
            onPress={this.userProfile.bind(this)}>
            <Image
              source={{uri: uri}}
              style={[styles.profileImage, {borderColor: buttonColor}]}
            />
          </TouchableHighlight>
          <View style={styles.buttonRowStyle}>
            <TouchableHighlight
              onPress={this.userSettings.bind(this)}>
              <Icon name="ios-settings-outline" size={40} color={buttonColor} style={{marginRight: 17}}/>
            </TouchableHighlight>
            <View style={styles.marginStyle}>
              <FacebookLogin
                auth={this.props.auth}
                storeResult={(action) => this.props.storeResult(action)}
                storeError={(action) => this.props.storeError(action)}
                loginRequest={this.props.loginRequest.bind(this)}
                logoutRequest={this.props.logoutRequest.bind(this)}
                loginError={(action) => this.props.loginError(action)}
                storeToken={(action) => this.props.storeToken(action)}
              />
              <TouchableHighlight style={styles.emailButton} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Log in with Email</Text>
              </TouchableHighlight>
            </View>
            <TouchableHighlight
              onPress={this.sendEmail.bind(this)}>
              <Icon name="ios-mail-outline" size={40} color={buttonColor} style={{marginLeft: 17}}/>
            </TouchableHighlight>
          </View>
        </View>

      </Image>
    )
  }
}

const styles = StyleSheet.create({
  containerImage: {
    flex: 1,
    resizeMode: 'contain',
    //  The null assignments below causes the renderer to re-determine size (which was broken
    // when the push direct to the camera view was implemented).
    height: null,
    width: null,
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 10,
  },
  buttonRowStyle: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center'
  },
  buttonColumnStyle: {
    flex: 1,
    alignItems: 'center'
  },
  marginStyle: {
    margin: 5,
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  horizontalScrollView: {
    height: 120,
  },
  containerPage: {
    height: 50,
    width: 50,
    backgroundColor: '#527FE4',
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: '#888888',
    left: 80,
    top: 20,
    height: 40,
  },
  button: {
    margin: 7,
    // padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  buttonContents: {
    flexDirection: 'row',
    width: 64,
    height: 64,
  },
  scrollViewContentStyle: {
  },
  // dontFuckWithStyle: {
  //   // TODO: Use PixelRatio.get() to divide the actual resolutions
  //   // down to the values below (PixelRatio is 3 on a iPhone 6s plus so
  //   // I manually got those number from (1242 by 1104) / 3. )
  //   height: 368,
  //   width: 414,
  // },
  flipBoardImageStyle: {
  },
  img: {
    width: 64,
    height: 64,
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },
  emailButton: {
    marginTop: 10,
    height: 30,
    backgroundColor: 'red',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})
*/}