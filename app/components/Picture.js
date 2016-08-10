import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

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
  }
  takePicture() {
    this.camera.capture((err, data) => {
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
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <View style={styles.shutterOuterViewStyle}>
            <TouchableHighlight style={styles.shutterInnerViewStyle} onPress={this.takePicture.bind(this)}>
              <View/>
            </TouchableHighlight>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
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
    marginBottom: 65,
    marginRight: 35,
    marginLeft: 35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
  }
});
