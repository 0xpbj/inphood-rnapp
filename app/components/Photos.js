import React, { Component } from "react";
import {StyleSheet, Text, TextInput, TouchableHighlight, View, Image} from "react-native";

import PhotoBrowser from '../../photoBrowser/lib';

const route = {
  type: 'push',
  route: {
    key: 'caption',
    title: 'Caption'
  }
}

export default class Photos extends Component {
  constructor(props) {
    super(props)
    this._onSelectionChanged = this._onSelectionChanged.bind(this)
  }
  _onSelectionChanged(media, index, selected) {
    if (selected) {
      this.props._selectPhoto(media.photo)
      this.props._handleNavigate(route)
    }
  }
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    let flag = nextProps.media.cameraMedia.length !== this.props.media.cameraMedia.length
    return flag
  }
  render() {
    return (
      <PhotoBrowser
        mediaList={this.props.media.cameraMedia}
        initialIndex={0}
        displayNavArrows={true}
        displaySelectionButtons={true}
        displayActionButton={false}
        startOnGrid={true}
        enableGrid={true}
        useCircleProgress
        onSelectionChanged={this._onSelectionChanged}
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
