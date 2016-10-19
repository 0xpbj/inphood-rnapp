import React, {Component} from 'react'
import {
  CameraRoll,
  Image,
  Platform,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ListView, 
  NativeModules,
  ActivityIndicator,
} from 'react-native'

import CommonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Meal Title'
  }
}

import Spinner from 'react-native-loading-spinner-overlay'

export default class CameraRollPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      lastCursor: null,
      loadingMore: false,
      noMore: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      count: this.props.library.count
    }
  }
  componentWillMount() {
    var {width} = Dimensions.get('window')
    var {imageMargin, imagesPerRow, containerWidth} = this.props
    if(typeof containerWidth != "undefined") {
      width = containerWidth
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow
    this.fetch()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.library.count > this.state.count) {
      this.setState ({
        images: [],
        lastCursor: null,
        loadingMore: false,
        noMore: false,
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        count: nextProps.library.count
      })
      this.fetch()
    }
  }
  fetch() {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => { this._fetch() })
    }
  }
  _fetch() {
    var {groupTypes, assetType} = this.props
    var fetchParams = {
      first: 20,
      groupTypes: groupTypes,
      assetType: assetType,
    }
    if (Platform.OS === "android") {
      // not supported in android
      delete fetchParams.groupTypes
    }
    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor
    }
    CameraRoll.getPhotos(fetchParams)
      .then((data) => this._appendImages(data), (e) => console.log(e))
  }
  _appendImages(data) {
    var assets = data.edges
    var newState = {
      loadingMore: false,
    }
    if (!data.page_info.has_next_page) {
      newState.noMore = true
    }
    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor
      newState.images = this.state.images.concat(assets)
      newState.dataSource = this.state.dataSource.cloneWithRows(
        this._nEveryRow(newState.images, this.props.imagesPerRow)
      )
    }
    this.setState(newState)
  }
  render() {
    var {imageMargin, backgroundColor} = this.props
    return (
      <View
        style={[CommonStyles.photoWrapper, {padding: imageMargin, paddingRight: 0, backgroundColor: backgroundColor},]}>
        <Spinner
          visible={this.state.images === 0}
          color='black'
        />
        <ListView
          renderFooter={this._renderFooterSpinner.bind(this)}
          onEndReached={this._onEndReached.bind(this)}
          dataSource={this.state.dataSource}
          renderRow={rowData => this._renderRow(rowData)} />
      </View>
    )
  }
  _renderImage(item) {
    var {imageMargin} = this.props
    return (
      <TouchableOpacity
        key={item.node.image.uri}
        style={{marginBottom: imageMargin, marginRight: imageMargin}}
        onPress={event => this._selectImage(item.node.image)}>
        <Image
          source={{uri: item.node.image.uri}}
          style={{height: this._imageSize, width: this._imageSize}} >
        </Image>
      </TouchableOpacity>
    )
  }
  _renderRow(rowData) {
    var items = rowData.map((item) => {
      if (item === null) {
        return null
      }
      return this._renderImage(item)
    })
    return (
      <View style={CommonStyles.photoRow}>
        {items}
      </View>
    )
  }
  _renderFooterSpinner() {
    if (!this.state.noMore) {
      return <ActivityIndicator/>
    }
    return null
  }
  _onEndReached() {
    if (!this.state.noMore) {
      this.fetch()
    }
  }
  _selectImage(image) {
    this.props._selectPhoto(image.uri)
    NativeModules.ReadImageData.readImage(image.uri, (data) => this.props._store64Library(data))
    this.props._handleNavigate(route)
  }
  _nEveryRow(data, n) {
    var result = [],
        temp = [];
    for (var i = 0; i < data.length; ++i) {
      if (i > 0 && i % n === 0) {
        result.push(temp)
        temp = []
      }
      temp.push(data[i])
    }
    if (temp.length > 0) {
      while (temp.length !== n) {
        temp.push(null)
      }
      result.push(temp)
    }
    return result
  }
  _arrayObjectIndexOf(array, property, value) {
    return array.map((o) => { return o[property]; }).indexOf(value)
  }
}

CameraRollPicker.propTypes = {
  groupTypes: React.PropTypes.oneOf([
    'Album',
    'All',
    'Event',
    'Faces',
    'Library',
    'PhotoStream',
    'SavedPhotos',
  ]),
  maximum: React.PropTypes.number,
  assetType: React.PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),
  imagesPerRow: React.PropTypes.number,
  imageMargin: React.PropTypes.number,
  containerWidth: React.PropTypes.number,
  callback: React.PropTypes.func,
  selectedMarker: React.PropTypes.element,
  backgroundColor: React.PropTypes.string,
}

CameraRollPicker.defaultProps = {
  groupTypes: 'SavedPhotos',
  maximum: 15,
  imagesPerRow: 3,
  imageMargin: 5,
  assetType: 'Photos',
  backgroundColor: 'white',
  callback: function(currentImage) {
    //console.log(currentImage)
  },
}
