'use strict'
import React, { Component } from 'react'
import {
  Text,
  View,
  Alert,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import CommonStyles from './styles/common-styles'

import Login from './EmailLogin'
import Comb from 'tcomb-form-native'

var AgeLimit = Comb.refinement(Comb.Number, function (n) {
  return n >= 14
})

var PassLimit = Comb.refinement(Comb.String, function (n) {
  return n.length >= 6
})

var Form = Comb.form.Form

var EmailSignUp = Comb.struct({
  firstname: Comb.String,
  lastname: Comb.String,
  age: AgeLimit,
  email: Comb.String,
  password: PassLimit,
  repeat_password: Comb.String,
  pictureURL: Comb.maybe(Comb.String),
})

var options = {
  fields: {
    email: {
      error: 'Insert a valid email',
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    password: {
      error: 'Password has to be at least 6 characters',
      autoCapitalize: 'none',
      autoCorrect: false,
      secureTextEntry: true
    },
    repeat_password: {
      autoCapitalize: 'none',
      autoCorrect: false,
      secureTextEntry: true
    },
    age: {
      error: 'User has to be older than 14'
    }
  },
  auto: 'placeholders'
}

export default class UserSignUp extends Component {
  constructor(props) {
    super(props)
  }
  componentWillUnmount() {
    this.props.goBack()
    this.props.goBack()
  }
  signup() {
    const value = this.refs.form.getValue()
    if (value && value.password !== value.repeat_password) {
      Alert.alert(
        'Password Mismatch',
        'Password\'s need to match'
      )
    }
    else if (value) {
      this.props.emailCreateUser(value)
      // this.props.goBack()
      // this.props.goBack()
    }
  }
  render() {
    return (
      <View style={CommonStyles.universalFormContainer}>

        <Form
          ref="form"
          type={EmailSignUp}
          options={options}/>

        <TouchableHighlight
          style={CommonStyles.prabhaavButton}
          onPress={this.signup.bind(this)}
          underlayColor='#99d9f4'>
          <Text style={CommonStyles.universalButtonTextStyling}>Sign Up</Text>
        </TouchableHighlight>

        {/*Placeholder view to consume the remaining bottom of the scene.*/}
        <View style={CommonStyles.flexContainer}/>

      </View>
    )
  }
}
