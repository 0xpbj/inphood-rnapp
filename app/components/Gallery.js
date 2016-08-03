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
const TimerMixin = require('react-timer-mixin');

import PhotoBrowser from '../../photoBrowser/lib'

export default class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      result: this.props.result,
      animating: true,
      mixins: [TimerMixin]
    }
    this._onSelectionChanged = this._onSelectionChanged.bind(this)
    this._onActionButton = this._onActionButton.bind(this)
  }
  setToggleTimeout() {
    this.state.mixins[0].setTimeout(() => {
      this.setState({animating: !this.state.animating})
    }, 1000);
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
  componentWillReceiveProps(nextProps) {
    this.setState({
      result: nextProps.result
    })
  }
  render() {
    if (this.state.result === null) {
      alert ('Please Login')
      return (<View />)
    }
    else if (this.state.animating) {
      this.setToggleTimeout()
      return (
        <View style={{backgroundColor: 'black'}}>
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      )
    }
    else {
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
          useCircleProgress={true}
          onSelectionChanged={this._onSelectionChanged}
          onActionButton={this._onActionButton}
          titleName={this.state.result.first_name}
        />
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
