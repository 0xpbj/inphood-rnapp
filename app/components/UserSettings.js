'use strict'
import React, { Component } from 'react'
import { 
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

export default class UserSettings extends Component {
  constructor(props) {
    super(props)
  }
  signup() {
    const value = this.refs.form.getValue();
    if (value) {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .catch (error => {
        alert(error.message)
      })
    }
  }
  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
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