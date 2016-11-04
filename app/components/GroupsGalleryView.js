'use strict'

import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  Picker,
  ListView,
  Platform,
  Dimensions,
  TouchableHighlight,
  RecyclerViewBackedScrollView,
} from 'react-native'

import CommonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'gchat',
    title: 'Group Feedback'
  }
}

import NetworkImage from './NetworkImage'
import Spinner from 'react-native-loading-spinner-overlay'
import Config from '../constants/config-vars'
const turlHead = Config.AWS_CDN_THU_URL

export default class GroupsGalleryView extends Component{
  constructor(props) {
    super(props)
    this.state = {dataSource: this._createDataSource([])}
  }
  componentWillMount() {
    const id = this.props.groups.id
    const vals = this.props.groups.photos[id]
    var data = []
    for (var key in vals) {
      if (vals[key][id])
        data.unshift(vals[key][id])
    }
    this.setState({
      dataSource: this._createDataSource(data),
    })
  }
  componentWillReceiveProps(nextProps) {
    const id = nextProps.groups.id
    const vals = nextProps.groups.photos[id]
    var data = []
    for (var key in vals) {
      if (vals[key][id])
        data.unshift(vals[key][id])
    }
    this.setState({
      dataSource: this._createDataSource(data),
    })
  }
  render() {
    let name = this.props.groups.name
    let content = <View />
    if (this.state.dataSource.getRowCount() !== 0) {
      content = <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={this._renderSeparator}
          removeClippedSubviews={false}
        />
    }
    else {
      content = <View style={CommonStyles.clientGalleryAddPhotosMessage}>
            <Text style={{textAlign: 'center'}}>Group does not have any photos</Text>
          </View>
    }
    return (
      <View style={CommonStyles.clientGalleryContainer}>
        {content}
      </View>
    )
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  _renderRow(data: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    const {fileName, mealType, time, uid, fileTail, caption, title, databasePath} = data
    const photo = turlHead + fileName
    const imgBlock = <NetworkImage source={{uri: photo}}/>
    const mealTime = new Date(time).toDateString()
    const flag = this.props.notification.groupPhotos[databasePath] 
    const notificationBlock = ( 
      <View style={CommonStyles.notificationView}>
        <Text style={CommonStyles.notificationText}>{flag}</Text>
      </View>
    )
    const showNotification = flag ? notificationBlock : <View />
    // TODO: refactor to common generating class (this is identical to GalleryListView.js)
    //
    return (
      <View>
        <TouchableHighlight onPress={() => {
            this._pressRow(data, databasePath, uid)
            highlightRow(sectionID, rowID)
          }}>
          <View style={CommonStyles.galleryRow}>
            <View style={CommonStyles.flexRow}>
              {imgBlock}
            </View>
            <View  style={CommonStyles.galleryText}>
              <Text style={CommonStyles.heavyFont}>
                {title}: {caption}
              </Text>
              <Text>
                {mealType}
              </Text>
              <Text style={CommonStyles.italicFont}>
                {mealTime}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        {showNotification}
      </View>
    )
  }
  _pressRow(photo: string, path: string, uid: string) {
    // this.props.markGroupPhotoRead(path, photo, uid)
    // this.props._handleNavigate(route)
    // this.props.feedbackPhoto(path, photo)
  }
  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={adjacentRowHighlighted ?
                  CommonStyles.adjacentRowHighlightedSeparator :
                  CommonStyles.adjacentRowNotHighlightedSeparator}
      />
    )
  }
}
