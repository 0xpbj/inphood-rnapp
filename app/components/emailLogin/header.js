'use strict'
import React, { Component } from 'react'
import { 
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay'

export default class header extends Component {
  render()
  {
    return (
      <View style={styles.header}>
        <View style={styles.header_item}>
          <Text style={styles.header_text}>{this.props.text}</Text>
        </View>
        <View style={styles.header_item}>
        {  !this.props.loaded &&
            <Spinner />
        }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flex: 1
  },
  header_item: {
    paddingLeft: 10,
    paddingRight: 10
  },
  header_text: {
    color: '#000',
    fontSize: 18
  }
})