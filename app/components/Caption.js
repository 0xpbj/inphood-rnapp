import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Picker,
  Dimensions,
  TouchableHighlight
} from 'react-native'

import Button from './Button'
import Spinner from 'react-native-loading-spinner-overlay';

var { width, height } = Dimensions.get('window');

export default class Caption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      size: this.props.gallery.photos.length
    }
  }
  _workBeforeTransition() {
    this.setState({
      animating: true
    })
    if (this.props._library) {
      this.props.sendAWSInitLibrary()
    }
    else {
      this.props.sendAWSInitCamera()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.gallery.photos.length > this.state.size) {
      this.props._transmit()
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            autoCapitalize="none"
            placeholder="Describe your meal..."
            returnKeyType="done"
            onSubmitEditing={(event) => this.props._storeCaption(event.nativeEvent.text)}
            style={styles.default}
          />
          <TouchableHighlight onPress={this.props._handleBackAction}>
            <Image
              style={styles.gif}
              source={{uri: this.props._selectedPhoto}}
            />
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1 }}>
          <Spinner color='black' visible={this.state.animating} />
        </View>
        <Picker style={{paddingBottom: 40}} >
          <Picker.Item label="Breakfast" value="Breakfast" />
          <Picker.Item label="Lunch" value="Lunch" />
          <Picker.Item label="Snack" value="Snack" />
          <Picker.Item label="Dinner" value="Dinner" />
        </Picker>
        <Button onPress={this._workBeforeTransition.bind(this)} label='Send'/>
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
    paddingTop: 65,
    flexDirection: 'column',
  },
  gif: {
    width: 80,
    height: 80,
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
