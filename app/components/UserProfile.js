'use strict'
import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native'

import CommonStyles from './styles/common-styles'

import Comb from 'tcomb-form-native'

var Form = Comb.form.Form
var UserProfileForm = Comb.struct({
  firstname: Comb.String,
  lastname: Comb.String,
  age: Comb.Number,
  diet: Comb.String,
  weight: Comb.Number,
  height: Comb.Number,
  location: Comb.String,
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
  },
  // auto: 'placeholders'
}

//  TODO: Add code to initialize the form value from the database

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
  }

  applyChanges() {
    // TODO:
  }

  render() {
    return (
      <View style={{flex: 1}}>

        <ScrollView style={{flex: 9}}>

          {/*<View style={CommonStyles.universalFormContainer}>*/}
          <View
            style={{justifyContent: 'center', padding: 20, backgroundColor: 'white'}}>

            <Form
              ref="form"
              type={UserProfileForm}
              options={options}/>

            <TouchableHighlight
              style={CommonStyles.prabhaavButton}
              onPress={this.applyChanges.bind(this)}
              underlayColor='#99d9f4'>
              <Text
                style={CommonStyles.universalButtonTextStyling}>
                Apply Changes
              </Text>
            </TouchableHighlight>

            {/*Placeholder view to consume the remaining bottom of the scene.*/}
            <View style={CommonStyles.flexContainer}/>

          </View>
        </ScrollView>

        <View style={{flex: 1}}/>

      </View>
    )
  }
}
