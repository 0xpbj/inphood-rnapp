'use strict'

import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Picker,
  TouchableHighlight
} from 'react-native'
import Button from './Button'

export default class Selected extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
            style={{height: (this.props._buttonName === 'Next') ? 396 : 446}}
            source={{uri: this.props._selectedPhoto}}
          />
        <Button onPress={()=>this.props._handleNavigate(this.props._nextRoute)} label={this.props._buttonName}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    paddingTop: 54,
  },
  default: {
    height: 80,
    borderWidth: 1.5,
    borderColor: 'black',
    flex: 1,
    fontSize: 20,
    padding: 4,
  },
})
