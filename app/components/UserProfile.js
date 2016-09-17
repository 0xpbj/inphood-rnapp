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
    console.log(this.props.auth.result.first_name)
    return (

      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 9}}
          contentContainerStyle={CommonStyles.universalFormScrollingContainer}>

            <Form
              ref="form"
              type={UserProfileForm}
              options={options}/>

            {/*Placeholder view to consume the remaining bottom of the scene.*/}
            <View style={CommonStyles.flexContainer}/>

        </ScrollView>

        <View style={{flex: 1, backgroundColor: 'white'}}/>

      </View>
    )
  }
}
