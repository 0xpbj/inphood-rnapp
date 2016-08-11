import React, { Component } from "react";
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableHighlight, View, Image, ListView, Animated, Dimensions} from "react-native";

import PhotoBrowser from '../../photoBrowser/lib';
import GridContainer from '../../photoBrowser/lib/GridContainer';

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Meal Title'
  }
}

const TOOLBAR_HEIGHT = 54;

export default class Photos extends Component {
  constructor(props) {
    super(props)
    this._onMediaSelection = this._onMediaSelection.bind(this)
    const mediaList = this.props.media.cameraMedia
    this.state = {
      dataSource: this._createDataSource(mediaList),
      mediaList: mediaList,
      fullScreenAnim: new Animated.Value(0),
    }
  }
  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.media.cameraMedia
    this.setState({
      dataSource: this._createDataSource(mediaList),
      mediaList: mediaList
    })
  }
  _onMediaSelection(index) {
    this.props._selectPhoto(this.state.mediaList[index].photo)
    this.props._handleNavigate(route)
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  render() {
    if (this.props.media.cameraMedia.length === 0) {
      return (
        <ActivityIndicator
          size="large"
          color="black"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            paddingTop: 250,
          }}
        />
      )
    }
    else {
      const {
        dataSource,
        mediaList,
        fullScreenAnim
      } = this.state
      const screenHeight = Dimensions.get('window').height;
      return (
        <View style={styles.container}>
          <Animated.View
            style={{
              height: screenHeight - 85,
              marginTop: fullScreenAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenHeight * -1 - TOOLBAR_HEIGHT],
              }),
            }}
          >
            <GridContainer
              dataSource={dataSource}
              displaySelectionButtons={false}
              // onPhotoTap={this._onGridPhotoTap}
              onPhotoTap={this._onMediaSelection}
            />
          </Animated.View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64
  },
  list: {
    flex: 1,
    paddingLeft: 16,
  },
  row: {
    flex: 1,
    padding: 8,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: 14,
  },
  rowDescription: {
    fontSize: 12,
  },
});
