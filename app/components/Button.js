import React from 'react'

import { Text, TouchableHighlight } from 'react-native'

var commonStyles = require('./styles/common-styles')

export default ({label, onPress, color}) => (
  <TouchableHighlight underlayColor={color} onPress={onPress} style={[commonStyles.button2, {backgroundColor: color}]}>
    <Text style={commonStyles.button2Label}>{label}</Text>
  </TouchableHighlight>
)
