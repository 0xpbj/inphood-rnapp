'use strict'
import React, { Component } from 'react'
import { 
  Text,
  View,
  TextInput,
  StyleSheet,
  AsyncStorage,
  TouchableHighlight
} from 'react-native'

import Comb from 'tcomb-form-native'
import Signup from './UserSignUp'

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
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Form
            ref="form"
            type={EmailLoginForm}
            options={options}
          />
          <TouchableHighlight style={styles.button} onPress={this.login.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.goToSignup.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  login() {
    const value = this.refs.form.getValue();
    if (value) {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .catch(error => {
        alert(error.message)
      })
    }
  }
  goToSignup() {
    this.props._handleNavigate(route)
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#006400',
    borderColor: '#006400',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})