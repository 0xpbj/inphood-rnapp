/* @flow */

'use strict';

import React, { Component } from 'react';

import {
  ListView,
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  Animated,
  Dimensions
} from 'react-native';

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Confirm Photo'
  }
}

import Spinner from 'react-native-loading-spinner-overlay';
import GridContainer from '../../photoBrowser/lib/GridContainer';

export default class GalleryView extends Component {
  constructor(props) {
    super(props)
    const mediaList = props.galleryView.photos
    this._onMediaSelection = this._onMediaSelection.bind(this)
    this.state = {
      result: this.props.result,
      size: this.props.galleryView.photos.length,
      dataSource: this._createDataSource(mediaList),
      mediaList: mediaList,
      fullScreenAnim: new Animated.Value(0),
      newUser: true,
    }
  }
  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.galleryView.photos
    this.setState({
      result: nextProps.result,
      size: nextProps.galleryView.photos.length,
      newUser: nextProps.galleryView.photos.length === 0 ? true : false,
      dataSource: this._createDataSource(mediaList),
      mediaList: mediaList
    })
  }
  _onMediaSelection(index) {
    this.props._handleNavigate(route)
    // console.log('Selected photo: ' + this.state.mediaList[index].photo)
    this.props._setFeedback(this.state.mediaList[index].photo)
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  render() {
    if (this.state.result === null) {
      alert ('Please Login')
      return (<View />)
    }
    else {
      const {
        dataSource,
        mediaList,
        fullScreenAnim
      } = this.state
      const screenHeight = Dimensions.get('window').height;
      let uri = this.state.result ? this.state.result.picture.data.url : ' '
      return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <Image
              source={{uri: uri}}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{this.state.result.first_name}'s InPhood</Text>
          </View>
          <Animated.View style={{height: screenHeight - 85}}>
            <GridContainer
              dataSource={dataSource}
              displaySelectionButtons={false}
              onPhotoTap={this._onMediaSelection}
            />
          </Animated.View>
          <View style={styles.container}>
            <Spinner
              visible={this.state.size === 0 && !this.state.newUser}
              color='black'
            />
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  profileImage: {
    marginLeft: 20,
    marginTop: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    marginLeft: 40,
    marginTop: 42,
    fontSize: 18,
    fontWeight: 'bold'
  }
});
