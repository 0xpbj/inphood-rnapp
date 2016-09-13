'use strict'
import React, { Component } from 'react'
import { 
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import commonStyles from './styles/common-styles'

import Login from './EmailLogin'
import Comb from 'tcomb-form-native'

var Form = Comb.form.Form
var EmailSignUp = Comb.struct({
  firstname: Comb.String,
  lastname: Comb.String,
  age: Comb.Number,
  email: Comb.String,
  password: Comb.String,
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
      autoCapitalize: 'none',
      autoCorrect: false,
      secureTextEntry: true
    }
  }
}

export default class UserSignUp extends Component {
  constructor(props) {
    super(props)
  }
  signup() {
    const value = this.refs.form.getValue();
    if (value) {
      this.props.emailCreateUser(value)
    }
  }
  componentWillUnmount() {
    this.props.goBack()
    this.props.goBack()
  }
  render() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={EmailSignUp}
          options={options}
        />
        <TouchableHighlight style={styles.prabhaavButton} onPress={this.signup.bind(this)} underlayColor='#99d9f4'>
          <Text style={[commonsStyles.universalButtonTextStyling]}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
})
