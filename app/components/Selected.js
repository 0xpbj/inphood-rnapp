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
    this.state = {
      title: '',
    }
  }
  _workBeforeTransition() {
    if ((this.props._buttonName === 'Next')) {
      let whiteSpace = new RegExp(/^\s+$/)
      if (this.state.title === '') {
        alert ('Please enter a meal title')
        return
      }
      else if (whiteSpace.test(this.state.title)) {
        alert ('Please enter a meal title')
        return
      }
      this.props._storeTitle(this.state.title)
      this.props._handleNavigate(this.props._nextRoute)
    }
    else {
      this.props._handleNavigate(this.props._nextRoute)
    }
  }
  render() {
    if (this.props._buttonName === 'Next') {
      return (
        <View style={styles.container}>
          <TextInput
            autoCapitalize="none"
            placeholder="Enter meal title..."
            returnKeyType="done"
            onEndEditing={
              (event) => {
                let text = event.nativeEvent.text
                let whiteSpace = new RegExp(/^\s+$/)
                if (text === '') {
                  alert ('Please enter a meal title')
                }
                else if (whiteSpace.test(text)) {
                  alert ('Please enter a meal title')
                }
                else {
                  this.setState({title: text})
                }
              }
            }
            style={styles.default}
          />
          <Image
              style={{height: 346}}
              source={{uri: this.props._selectedPhoto}}
            />
          <Button onPress={this._workBeforeTransition.bind(this)} label={this.props._buttonName}/>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <Image
              style={{height: 436}}
              source={{uri: this.props._selectedPhoto}}
            />
          <Button onPress={this._workBeforeTransition.bind(this)} label={this.props._buttonName}/>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    paddingTop: 64,
  },
  default: {
    height: 40,
    borderColor: 'black',
    flex: 1,
    fontSize: 20,
    padding: 4,
  },
})
