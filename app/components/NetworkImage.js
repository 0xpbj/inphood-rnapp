'use strict'

import React, {Component} from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  View
} from 'react-native'

import CommonStyles from './styles/common-styles'

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
    // Workaround:  check to see if progress > 0 before showing activity indicator
    // (on Android it appears onLoad is not doign what we want)
    //
    var loader = (this.state.progress > 0 && this.state.loading) ?
          <View style={CommonStyles.networkImageProgress}>
            <Text>{this.state.progress}%</Text>
            <ActivityIndicator style={{marginLeft:5}} />
          </View> : null;
        return this.state.error ?
          <Text>{this.state.error}</Text> :
          <Image
            source={this.props.source}
            style={CommonStyles.networkImageBase}
            onLoadStart={(e) => this.setState({loading: true})}
            onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
            onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
            onLoad={() => this.setState({loading: false, error: false})}>
            {loader}
          </Image>;
  }
}
