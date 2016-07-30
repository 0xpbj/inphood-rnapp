/* @flow */

'use strict';

import React, { Component } from "react";
import {AppRegistry, StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
  AccessToken,
  Profile,
} = FBSDK;

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
  render() {
    console.disableYellowBox = true;
    let uri = this.props.auth.result ? this.props.auth.result.picture.data.url : ' '
    return (
      <Image source={require('./img/LaunchRetina4_High.png')} style={styles.containerImage}>
        <View style={styles.quarterHeightContainer}/>
        <View style={styles.quarterHeightContainer}/>
        <View style={styles.dimeHeightContainer}/>
        <View style={styles.quarterHeightContainer}>
          <Image
            source={{uri: uri}}
            style={styles.profileImage}
          />
          <View style={styles.buttonRowStyle}>
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
          </View>
        </View>
      </Image>
    );
  }
};

const styles = StyleSheet.create({
  dimeHeightContainer: {
    flex: 0.15,
    alignItems: 'center',
  },
  quarterHeightContainer: {
    flex: 0.25,
    alignItems: 'center',
  },
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
    // borderWidth: 1,
    // borderColor: '#3b5998',
    // marginBottom: 10,
  },
  buttonRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonColumnStyle: {
    flex: 1,
    alignItems: 'center'
  },
  marginStyle: {
    margin: 5,
  },
});
