'use strict'
import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableHighlight
} from 'react-native'

import Comb from 'tcomb-form-native'
import Signup from './UserSignUp'

import commonStyles from './styles/common-styles'

var Form = Comb.form.Form
var EmailLoginForm = Comb.struct({
  email: Comb.String,         // a required string
  password: Comb.String,  // a required string
})
var options = {
  fields: {
    email: {
      error: 'Insert a valid email',
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    password: {
      autoCapitalize: 'none',
      autoCorrect: false,
      secureTextEntry: true
    }
  }
}

const route = {
  type: 'push',
  route: {
    key: 'signup',
    title: 'User Signup'
  }
}

export default class EmailLogin extends Component {
  constructor(props) {
    super(props)
  }
  componentWillUnmount() {
    this.props.goBack()
  }
  render() {
    return (
      <View style={commonStyles.emailLoginContainer}>
        <View style={commonStyles.emailLoginBody}>
          <Form
            ref="form"
            type={EmailLoginForm}
            options={options}
          />
          <TouchableHighlight style={commonStyles.prabhaavButton} onPress={this.login.bind(this)} underlayColor='#99d9f4'>
            <Text style={commonStyles.universalButtonTextStyling}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight style={commonStyles.prabhaavButton} onPress={this.goToSignup.bind(this)} underlayColor='#99d9f4'>
            <Text style={commonStyles.universalButtonTextStyling}>Sign Up</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  login() {
    const value = this.refs.form.getValue();
    if (value) {
      this.props.emailLoginRequest(value)
    }
  }
  goToSignup() {
    this.props._handleNavigate(route)
  }
}
