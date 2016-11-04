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

import Comb from 'tcomb-form-native'

var Form = Comb.form.Form

var GroupSignUp = Comb.struct({
  groupname: Comb.String,
  pictureURL: Comb.maybe(Comb.String),
})

export default class CreateGroup extends Component {
  constructor(props) {
    super(props)
  }
  signup() {
    const value = this.refs.form.getValue()
    let found = false
    for (let index in this.props.groups) {
      if (value.groupname === this.props.groups[index]){
        found = true
        break
      }
    }
    if (found) {
      Alert.alert('Name Error', 'Group name has already been used.')
    }
    else if (value) {
      this.props.createGroup(value)
      this.props.goBack()
    }
  }
  render() {
    return (
      <View style={CommonStyles.universalFormContainer}>
        <Form
          ref="form"
          type={GroupSignUp}
          options={{auto: 'placeholders'}}/>

        <TouchableHighlight
          style={CommonStyles.formButton}
          onPress={this.signup.bind(this)}
          underlayColor='#99d9f4'>
          <Text style={CommonStyles.universalButtonTextStyling}>Create group</Text>
        </TouchableHighlight>

        {/*Placeholder view to consume the remaining bottom of the scene.*/}
        <View style={CommonStyles.flexContainer}/>
      </View>
    )
  }
}
