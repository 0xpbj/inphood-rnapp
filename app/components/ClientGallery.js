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
    if (data.length !== 0) {
      var photoNotifications = []
      for (let index in data) {
        photoNotifications[data[index].photo] = data[index].notification
      }
      console.log('Initial notifications: ')
      console.log(photoNotifications)
      this.setState({
        dataSource: this._createDataSource(data),
        photoNotifications: photoNotifications
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const id = nextProps.trainerData.clientId
    const vals = (nextProps.trainerData.photos)
    var data = []
    for (var key in vals) {
      if (vals[key][id])
        data.unshift(vals[key][id])
    }
    if (data.length !== 0) {
      var photoNotifications = []
      for (let index in data) {
        photoNotifications[data[index].photo] = data[index].notification
      }
      console.log('New notifications: ')
      console.log(photoNotifications)
      this.setState({
        dataSource: this._createDataSource(data),
        photoNotifications: photoNotifications
      })
    }
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
    const path = '/global/' + data.file.uid + '/photoData/' + data.file.fileTail
    const flag = this.state.photoNotifications[imgSource]
    const notificationBlock = ( <View style={CommonStyles.notificationView}>
              <Text style={CommonStyles.notificationText}> </Text>
            </View> )
    const showNotification = flag ? notificationBlock : <View />

    // TODO: refactor to common generating class (this is identical to GalleryListView.js)
    //
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(data.photo, path)
          highlightRow(sectionID, rowID)
        }}>
        <View style={CommonStyles.galleryRow}>
          <View style={CommonStyles.flexRow}>
            {imgBlock}
            {showNotification}
          </View>
          <View  style={CommonStyles.galleryText}>
            <Text style={CommonStyles.heavyFont}>
              {data.title}: {data.caption}
            </Text>
            <Text>
              {mealType}
            </Text>
            <Text style={commonsStyles.italicFont}>
              {mealTime}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  _pressRow(imgSource: string, path: string) {
    let newNotifications = this.state.photoNotifications
    newNotifications[imgSource] = false
    this.setState({
      photoNotifications: newNotifications
    })
    this.props.markPhotoRead(path)
    this.props._handleNavigate(route)
    this.props.feedbackPhoto(imgSource)
  }
  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={adjacentRowHighlighted ?
                  adjacentRowHighlightedSeparator :
                  adjacentRowNotHighlightedSeparator}
      />
    )
  }
}
