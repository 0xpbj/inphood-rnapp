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
var Height = Comb.enums({
  H83: '6\'11\"',
  H82: '6\'10\"',
  H81: '6\'9\"',
  H80: '6\'8\"',
  H79: '6\'7\"',
  H78: '6\'6\"',
  H77: '6\'5\"',
  H76: '6\'4\"',
  H75: '6\'3\"',
  H74: '6\'2\"',
  H73: '6\'1\"',
  H72: '6\'0\"',
  H71: '5\'11\"',
  H70: '5\'10\"',
  H69: '5\'9\"',
  H68: '5\'8\"',
  H67: '5\'7\"',
  H66: '5\'6\"',
  H65: '5\'5\"',
  H64: '5\'4\"',
  H63: '5\'3\"',
  H62: '5\'2\"',
  H61: '5\'1\"',
  H60: '5\'0\"',
  H59: '4\'11\"',
  H58: '4\'10\"',
  H57: '4\'9\"',
  H56: '4\'8\"',
  H55: '4\'7\"',
  H54: '4\'6\"',
  H53: '4\'5\"',
  H52: '4\'4\"',
  H51: '4\'3\"',
  H50: '4\'2\"',
  H49: '4\'1\"',
  H48: '4\'0\"',
  H47: '3\'11\"',
  H46: '3\'10\"',
  H45: '3\'9\"',
  H44: '3\'8\"',
  H43: '3\'7\"',
  H42: '3\'6\"',
  H41: '3\'5\"',
  H40: '3\'4\"',
  H39: '3\'3\"',
  H38: '3\'2\"',
  H37: '3\'1\"',
  H36: '3\'0\"',
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
  firstName: Comb.String,
  lastName: Comb.maybe(Comb.String),
  birthday: Comb.Date,
  diet: Diet,
  height: Height,
  email: Comb.maybe(Comb.String),
  password: Comb.maybe(Comb.String),
  pictureURL: Comb.maybe(Comb.String),
})

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
  }
  storeFormData() {
    let value = this.refs.form.getValue()
    if (value) {
      console.log(value.diet)
      this.props._storeForm(value)
      this.props.goBack()
    }
  }
  dateFormat(date) {
    let monthString = ''
    switch(date.getMonth()) {
      case 0:
        monthString = 'January'
        break;
      case 1:
        monthString = 'February'
        break;
      case 2:
        monthString = 'March'
        break;
      case 3:
        monthString = 'April'
        break;
      case 4:
        monthString = 'May'
        break;
      case 5:
        monthString = 'June'
        break;
      case 6:
        monthString = 'July'
        break;
      case 7:
        monthString = 'August'
        break;
      case 8:
        monthString = 'September'
        break;
      case 9:
        monthString = 'October'
        break;
      case 10:
        monthString = 'November'
        break;
      default:
        // error will always be December b/c it's a great month!
        monthString = 'December'
        break;
    }
    let newDateString = monthString + ' ' + String(date.getDate()) + ', ' + String(date.getFullYear())

    return (newDateString)
  }
  render() {
    // Minimum user age is 13 for our product (California Law)
    // TODO: Need warning somewhere about this and parental consent
    //
    //    millisecondsFor13Years = 13 yrs * 365.25 d/yr * 24 hr/d * 60 min/hr *
    //                             60 sec/min * 1000ms/sec
    let millisecondsFor13Years = 13 * 365.25 * 24 * 60 * 60 * 1000
    let maximumDate = new Date(Date.now() - millisecondsFor13Years)

    if (this.props.auth.result.provider === "facebook.com") {
      // User Profile form for FACEBOOK AUTHENTICATED USERS:
      //
      var options = {
        fields: {
          firstName: {
            editable: false,
          },
          lastName: {
            editable: false,
          },
          birthday: {
            label: 'Birthday',
            mode: 'date',
            hidden: true,
          },
          diet: {
            error: 'Please select a diet ...',
            nullOption: {value: '', text: 'Choose a diet ...'},
          },
          height: {
            error: 'Please select your height ...',
            nullOption: {value: '', text: 'Select your height ...'},
          },
          email: {
            editable: false,
            hidden: true,
          },
          password: {
            editable: false,
            hidden: true,
          },
          pictureURL: {
            editable: false,
            hidden: true,
          },
        },
        auto: 'placeholders',
      };
    } else {
      // User Profile form for EMAIL AUTHENTICATED USERS:
      //
      var options = {
        fields: {
          firstName: {
            error: 'Please enter your first name'
          },
          birthday: {
            label: 'Birthday:',
            mode: 'date',
            maximumDate: maximumDate,
            config: {
              format: this.dateFormat,
            }
          },
          diet: {
            error: 'Please select a diet ...',
            nullOption: {value: '', text: 'Choose a diet ...'},
          },
          height: {
            error: 'Please select your height ...',
            nullOption: {value: '', text: 'Select your height ...'},
          },
          email: {
            error: 'Insert a valid email',
            autoCapitalize: 'none',
            autoCorrect: false,
            hidden: true,
          },
          password: {
            autoCapitalize: 'none',
            autoCorrect: false,
            secureTextEntry: true
          },
          pictureURL: {
            editable: false,
            hidden: true,
          },
        },
        auto: 'placeholders',
      }
    }

    let value = {
      firstName: this.props.auth.result.first_name,
      lastName: this.props.auth.result.last_name,
      email: this.props.auth.result.email,
      pictureURL: this.props.auth.result.picture,
    }

    console.log("Email = " + this.props.auth.result.email)
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
