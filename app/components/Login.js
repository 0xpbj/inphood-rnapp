/* @flow */

'use strict';

import React, { Component } from "react";
import {AppRegistry, StyleSheet, Text, TouchableOpacity, View, Image, NativeModules, ScrollView, Platform} from "react-native";
// import Swiper from 'react-native-swiper'
import SwipeALot from 'react-native-swipe-a-lot'

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
  AccessToken,
  Profile,
} = FBSDK;

import Icon from 'react-native-vector-icons/Ionicons'
import Device from 'react-native-device'
var Mailer = require('NativeModules').RNMail

export default class Login extends Component {
  constructor(props) {
    super(props);
    this._responseInfoCallback = this._responseInfoCallback.bind(this);
  }
  //Create response callback.
  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
      this.props.storeError(error)
    }
    else {
      if (this.props.auth.token) {
        this.props.storeResult(result)
        this.props.loginRequest()
      }
      else {
        alert ('Please login.')
      }
    }
  }
  componentDidMount() {
    if (this.props.auth.token === '') {
      AccessToken.getCurrentAccessToken()
      .then(
        (token) => {
          this.props.storeToken(token.accessToken.toString())
          const infoRequest = new GraphRequest(
            '/me?fields=id,email,gender,birthday,first_name,last_name,name,picture.type(normal)',
            null,
            this._responseInfoCallback
          );
          // Start the graph request.
          const graphManager = new GraphRequestManager();
          graphManager.addRequest(infoRequest);
          graphManager.start();
        }
      );
    }
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
    console.disableYellowBox = true;
    let uri = this.props.auth.result ? this.props.auth.result.picture.data.url : ' '
    let buttonColor = this.props.auth.result ? '#006400' : 'white'
    return (
      <Image source={require('./img/HD_5_5.png')} style={styles.containerImage}>

        <View style={{flex: 1, backgroundColor: 'transparent'}}/>

        {/*<View style={{flex: 2, backgroundColor: 'transparent'}}>
          <Swiper autoplay={true} loadMinimal={true} showsPagination={true} height={400}>
            <View style={{flex: 1, backgroundColor: 'transparent'}}>
              <Image style={{flex: 1}} source={require('./img/exampleBanana.jpg')}/>
            </View>
            <View style={{flex: 1, backgroundColor: 'transparent'}}>
              <Image source={require('./img/exampleBanana.jpg')}/>
            </View>
          </Swiper>
        </View>*/}

        <View style={{flex: 2, backgroundColor: 'transparent'}}>
          <SwipeALot>
            <View style={{flex: 1, backgroundColor: 'transparent'}}>
              <Image source={require('./img/exampleBanana.jpg')}/>
            </View>
            <View style={{flex: 1, backgroundColor: 'transparent'}}>
              <Image source={require('./img/exampleBanana.jpg')}/>
            </View>
          </SwipeALot>
        </View>


        <View style={{flex: 1, top: 10, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={this.userProfile.bind(this)}>
            <Image
              source={{uri: uri}}
              style={[styles.profileImage, {borderColor: buttonColor}]}
            />
          </TouchableOpacity>
          <View style={styles.buttonRowStyle}>
            <TouchableOpacity
              onPress={this.userSettings.bind(this)}>
              <Icon name="ios-settings-outline" size={40} color={buttonColor} style={{marginRight: 17}}/>
            </TouchableOpacity>
            <View style={styles.marginStyle}>
              <LoginButton
               onLoginFinished={(error, result) => {
                 if (error) {
                   this.props.loginError(error)
                   alert('Error logging in.')
                 }
                 else {
                   if (result.isCanceled) {
                     alert('Login cancelled.')
                   } else {
                     AccessToken.getCurrentAccessToken()
                     .then(
                       (token) => {
                         this.props.storeToken(token.accessToken.toString())
                         // Create a graph request asking for user information with a callback to handle the response.
                         const infoRequest = new GraphRequest(
                           '/me?fields=id,email,gender,birthday,first_name,last_name,name,picture.type(normal)',
                           null,
                           this._responseInfoCallback
                         );
                         // Start the graph request.
                         const graphManager = new GraphRequestManager();
                         graphManager.addRequest(infoRequest);
                         graphManager.start();
                       }
                     )
                   }
                 }
               }}
               onLogoutFinished={() => this.props.logoutRequest()}
               readPermissions={["email", "user_friends", "user_birthday", "user_photos", "public_profile"]}
               publishPermissions={['publish_actions']}
             />
            </View>
            <TouchableOpacity
              onPress={this.sendEmail.bind(this)}>
              <Icon name="ios-mail-outline" size={40} color={buttonColor} style={{marginLeft: 17}}/>
            </TouchableOpacity>
          </View>
        </View>

      </Image>
    );
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
  img: {
    width: 64,
    height: 64,
  }
})
