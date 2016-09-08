import React from 'react'

import { Text, TouchableHighlight, StyleSheet } from 'react-native'

export default ({label, onPress, color}) => (
  <TouchableHighlight underlayColor={color} onPress={onPress} style={[styles.button, {backgroundColor: color}]}>
    <Text style={styles.label}>{label}</Text>
  </TouchableHighlight>
)

var styles = StyleSheet.create({
  button: {
    height: 70,
    // backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: 'white',
    fontSize: 20,
  }
})
