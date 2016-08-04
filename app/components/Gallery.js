/* @flow */

'use strict';

import React, { Component } from 'react';

import {
  ActionSheetIOS,
  CameraRoll,
  ListView,
  StyleSheet,
  Navigator,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator
} from 'react-native';

import PhotoBrowser from '../../photoBrowser/lib'
import Spinner from 'react-native-loading-spinner-overlay';

export default class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      result: this.props.result,
      size: this.props.gallery.photos.length
    }
    this._onActionButton = this._onActionButton.bind(this)
  }
  _onActionButton(media, index) {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: media.photo,
        message: media.caption,
      },
      () => {},
      () => {});
    } else {
      // alert(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      result: nextProps.result,
      size: nextProps.gallery.photos.length
    })
  }
  render() {
    if (this.state.result === null) {
      alert ('Please Login')
      return (<View />)
    }
    else {
      return (
        <View>
          <PhotoBrowser
            onBack={navigator.pop}
            mediaList={this.props.gallery.photos}
            initialIndex={0}
            displayNavArrows={true}
            displaySelectionButtons={false}
            displayActionButton={false}
            startOnGrid={true}
            enableGrid={true}
            useCircleProgress={true}
            onActionButton={this._onActionButton}
            titleName={this.state.result.first_name}
          />
          <View style={{ flex: this.state.size === 0 ? 1 : 0 }}>
            <Spinner
              visible={this.state.size === 0}
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
  },
  list: {
    flex: 1,
    paddingTop: 54,
    paddingLeft: 16,
  },
  centering: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 260,
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
