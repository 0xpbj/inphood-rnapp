'use strict'
import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native'

import commonStyles from './styles/common-styles'

export default class UserProfile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={commonStyles.universalContainer}>
        <Text>Hello Profile!</Text>
      </View>
    )
  }
}
