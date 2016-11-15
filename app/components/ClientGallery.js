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
    key: 'tchat',
    title: 'Feedback'
  }
}

import NetworkImage from './NetworkImage'
import Spinner from 'react-native-loading-spinner-overlay'
import Config from 'react-native-config'
const turlHead = Config.AWS_CDN_THU_URL

export default class ClientGallery extends Component{
  constructor(props) {
    super(props)
    this.state = {dataSource: this._createDataSource([])}
  }
  componentWillMount() {
    const id = this.props.clientData.clientId
    const vals = this.props.trainer.photos
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
    const id = nextProps.clientData.clientId
    const vals = nextProps.trainer.photos
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
    let name = this.props.clientData.clientName.split(' ')
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
            <Text style={{textAlign: 'center'}}>Client has not added new photos</Text>
          </View>
    }
    return (
      <View style={CommonStyles.clientGalleryContainer}>
        <View style={CommonStyles.flexRowMarginBottom10}>
          <Image
            source={{uri: this.props.clientData.clientPhoto}}
            style={CommonStyles.clientGalleryProfileImage}
          />
          <Text style={CommonStyles.clientGalleryProfileNameText}>{name[0]}'s inPhood</Text>
        </View>
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
    const flag = this.props.notification.clientPhotos[databasePath] 
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
    this.props.markClientPhotoRead(path, photo, uid)
    this.props.feedbackPhoto(path, photo)
    this.props._handleNavigate(route)
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
