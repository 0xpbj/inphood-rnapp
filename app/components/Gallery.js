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
} from 'react-native';

import PhotoBrowser from '../../photoBrowser/lib';

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButton = this._onActionButton.bind(this);
  }
  _onSelectionChanged(media, index, selected) {
    alert(`${media.photo} selection status: ${selected}`);
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
      alert(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  }
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    let flag = nextProps.gallery.count > this.props.gallery.count
    return flag
  }
  render() {
    return (
      <PhotoBrowser
        onBack={navigator.pop}
        mediaList={this.props.gallery.photos}
        initialIndex={0}
        displayNavArrows={true}
        displaySelectionButtons={false}
        displayActionButton={false}
        startOnGrid={true}
        enableGrid={true}
        useCircleProgress
        onSelectionChanged={this._onSelectionChanged}
        onActionButton={this._onActionButton}
      />
    );
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
