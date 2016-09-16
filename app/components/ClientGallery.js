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
import TimerMixin from 'react-timer-mixin'
import Spinner from 'react-native-loading-spinner-overlay'

export default class ClientGallery extends Component{
  constructor(props) {
    super(props)
    this.state = {dataSource: this._createDataSource([])}
  }
  componentWillMount() {
    const id = this.props.trainerData.clientId
    const vals = this.props.trainerData.photos
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
    const id = nextProps.trainerData.clientId
    const vals = nextProps.trainerData.photos
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
    let name = this.props.trainerData.clientName.split(' ')
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
            <Text>Client has not added new photos</Text>
          </View>
    }
    return (
      <View style={CommonStyles.clientGalleryContainer}>
        <View style={CommonStyles.flexRowMarginBottom10}>
          <Image
            source={{uri: this.props.trainerData.clientPhoto}}
            style={CommonStyles.clientGalleryProfileImage}
          />
          <Text style={CommonStyles.clientGalleryProfileNameText}>{name[0]}'s InPhood</Text>
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
    const imgSource = data.photo
    const imgBlock = <NetworkImage source={{uri: data.photo}}/>
    const mealType = data.mealType
    const mealTime = new Date(data.time).toDateString()
    const uid = data.file.uid
    const path = '/global/' + uid + '/photoData/' + data.file.fileTail
    const flag = this.props.notification.trainerPhotos[imgSource]
    const notificationBlock = ( 
      <View style={CommonStyles.notificationView}>
        <Text style={CommonStyles.notificationText}>{flag}</Text>
      </View>
    )
    const showNotification = flag ? notificationBlock : <View />
    // const showNotification = notificationBlock

    // TODO: refactor to common generating class (this is identical to GalleryListView.js)
    //
    return (
      <View>
        <TouchableHighlight onPress={() => {
            this._pressRow(data.photo, path, uid)
            highlightRow(sectionID, rowID)
          }}>
          <View style={CommonStyles.galleryRow}>
            <View style={CommonStyles.flexRow}>
              {imgBlock}
            </View>
            <View  style={CommonStyles.galleryText}>
              <Text style={CommonStyles.heavyFont}>
                {data.title}: {data.caption}
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
    this.props.markPhotoRead(path, photo, uid)
    this.props._handleNavigate(route)
    this.props.feedbackPhoto(photo)
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
