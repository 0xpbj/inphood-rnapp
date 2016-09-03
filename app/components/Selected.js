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
      color: 'grey',
    }
  }
  _workBeforeTransition() {
    this.props._storeTitle(this.state.title)
    this.props._handleNavigate(this.props._nextRoute)
  }
  _pauseBeforeTransition() {
    let whiteSpace = new RegExp(/^\s+$/)
    if (this.state.title === '') {
      alert ('Please enter a meal title')
      return
    }
    else if (whiteSpace.test(this.state.title)) {
      alert ('Please enter a proper meal title')
      return
    }
    // this.setState({color: '#22a3ed'})
    this._workBeforeTransition()
  }
  render() {
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
                this.setState({title: '', color: 'grey'})
                alert ('Please enter a meal title')
              }
              else if (whiteSpace.test(text)) {
                this.setState({title: '', color: 'grey'})
                alert ('Please enter a proper meal title')
              }
              else {
                this.setState({title: text, color: '#006400'})
              }
            }
          }
          style={styles.default}
        />
        <Image
          style={{height: 345}}
          source={{uri: this.props._selectedPhoto}}
        />
        <Button
          onPress={this._pauseBeforeTransition.bind(this)}
          label='Next'
          color={this.state.color}
        />
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
  default: {
    height: 40,
    borderWidth: 2,
    borderColor: 'black',
    flex: 1,
    fontSize: 20,
    padding: 4,
  },
})
