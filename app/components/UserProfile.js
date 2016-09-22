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
import Button from './Button'
import Comb from 'tcomb-form-native'

var Form = Comb.form.Form
// TODO: Complete this with complete list
var Diet = Comb.enums({
  N: 'No Specific Diet',
  V: 'Vegetarian',
  U: 'Vegan',
  P: 'Paleo',
})
var Positive = Comb.refinement(Comb.Number, function(n) {
  return n >= 0
})
// TODO: This component really sucks, but I wasn't able to
// get react-form to work after ~2 hours.  Talk to PBJ about
// getting react-form to work and scoping out some of this
// data for MVP (i.e. Location, Height, pictureURL--should
// really be a picker from the camera roll)
//
// There's all kinds of problems to deal with here too:
// - Diet has a '-' enum
// - Things take forever when you click on edit boxes
//
// If we don't scope things mentioned above out, we'll need
// to add storage to them in Firebase and better pickers
// for things like height / weight (with units etc.)
var UserProfileForm = Comb.struct({
  firstname: Comb.String,
  lastname: Comb.String,
  birthday: Comb.Date,
  diet: Diet,
  weight: Positive,
  height: Positive,
  location: Comb.String,
  email: Comb.maybe(Comb.String),
  password: Comb.maybe(Comb.String),
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
  auto: 'placeholders'
}

//  TODO: Add code to initialize the form value from the database

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
  }
  storeFormData() {
    let value = this.refs.form.getValue()
    if (value) {
      this.props._storeForm(value)
      this.props.goBack()
    }
  }
  render() {
    let value = {
      firstname: this.props.auth.result.first_name,
      lastname: this.props.auth.result.last_name,
      email: this.props.auth.result.email,
      pictureURL: this.props.auth.result.picture,
    }
    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 8.2}}
          contentContainerStyle={CommonStyles.universalFormScrollingContainer}>
            <Form
              ref="form"
              value={value}
              type={UserProfileForm}
              options={options}/>
            <View style={CommonStyles.flexContainer}/>
        </ScrollView>
        <View style={{flex: 0.8, backgroundColor: 'white'}}>
          <Button
            onPress={this.storeFormData.bind(this)}
            label='Submit'
            color='#006400'
          />
        </View>
        <View style={{flex: 1, backgroundColor: 'white'}}/>
      </View>
    )
  }
}
