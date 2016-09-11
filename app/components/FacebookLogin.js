/* @flow */

'use strict'

import React, { Component } from "react"

const FBSDK = require('react-native-fbsdk')
const {
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  LoginManager,
  AccessToken,
  Profile,
} = FBSDK

export default class FacebookLogin extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <LoginButton
       onLoginFinished={(error, result) => {
         if (error) {
           this.props.loginError(error)
           alert('Error logging in.')
         }
         else {
           if (result.isCanceled) {
             alert('Login cancelled.')
           } 
           else {
            this.props.loginRequest()
            this.props._setModalVisible(false)
           }
         }
       }}
       onLogoutFinished={() => this.props.logoutRequest()}
       readPermissions={["email", "user_friends", "user_birthday", "user_photos", "public_profile"]}
       publishPermissions={['publish_actions']}
     />
    )
  }
}