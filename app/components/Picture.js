import React, { Component } from "react";
import {StyleSheet, Text, TextInput, TouchableHighlight, View, Image} from "react-native";

import Camera from 'react-native-camera'

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Confirm Photo'
  }
}

export default class Picture extends Component {
  constructor(props) {
    super(props);
    this._takePicture = this._takePicture.bind(this);
    this.state = {
      cameraType: Camera.constants.Type.back,
    };
  }
  _takePicture() {
    this.refs.cam.capture((err, data) => {
      if (err) {
        console.log ('Camera Error')
      }
      else {
        this.props._takePhoto(data)
        this.props._handleNavigate(route)
      }
    })
  }
  render () {
    return (
      <Camera
        ref="cam"
        style={styles.container}
        type={this.state.cameraType}>
        <View style={styles.quarterHeightContainer}/>
        <View style={styles.quarterHeightContainer}/>
        <View style={styles.quarterHeightContainer}>
          {/*Placeholder to match buttonbar height in start/login page.*/}
          <View style={{height:60}}/>
          <View style={styles.buttonRowStyle}>
            {/* Outer view is  circular shutter outline that is not animated as per Apple, by TouchableHighlight. */}
            <View style={styles.shutterOuterViewStyle}>
              {/*// return <ImageCaption _goBack={this._handleBackAction.bind(this)} _captureText={this._captureText.bind(this)} />*/}
              <TouchableHighlight style={styles.shutterInnerViewStyle} onPress={this._takePicture.bind(this)}>
                {/*Empty view needed as child for TouchableHighlight ...*/}
                <View/>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Camera>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  quarterHeightContainer: {
    flex: 0.25,
    alignItems: 'center',
  },
  buttonRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  marginStyle: {
    margin: 5,
  },
  shutterInnerViewStyle: {
    marginTop: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3b5998',
  },
  shutterOuterViewStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 35,
    marginLeft: 35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
  }
});
