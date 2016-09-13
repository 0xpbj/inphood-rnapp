'use strict'

import React, {Component} from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  View
} from 'react-native'

import commonStyles from './styles/common-styles'

export default class NetworkImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      loading: false,
      progress: 0
    }
  }
  render() {
    var loader = this.state.loading ?
      <View style={commonStyles.networkImageProgress}>
        <Text>{this.state.progress}%</Text>
        <ActivityIndicator/>
      </View> : null;
    return this.state.error ?
      <Text>{this.state.error}</Text> :
      <Image
        source={this.props.source}
        style={commonStyles.networkImageBase}
        onLoadStart={(e) => this.setState({loading: true})}
        onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
        onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
        onLoad={() => this.setState({loading: false, error: false})}>
        {loader}
      </Image>;
  }
}
