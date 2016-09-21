'use strict'

import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  Modal,
  Picker,
  ListView,
  AlertIOS,
  Platform,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  RecyclerViewBackedScrollView
} from 'react-native'

import CommonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'chat',
    title: 'Feedback'
  }
}

import NetworkImage from './NetworkImage'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/Ionicons'
// import RNFS from 'react-native-fs'

export default class GalleryListView extends Component{
  constructor(props) {
    super(props)
    const mediaList = props.galleryView.photos
    this.state = {
      mediaList: mediaList,
      result: this.props.result,
      dataSource: this._createDataSource(mediaList),
    }
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.galleryView.photos
    const nextLength = mediaList.length
    const length = this.state.mediaList
    if (nextLength > length || mediaList[nextLength-1] !== this.state.mediaList[length-1] || this.state.result !== nextProps.result) {
      console.log('new props')
      this.setState({
        mediaList: mediaList,
        result: nextProps.result,
        dataSource: this._createDataSource(mediaList),
      })
    }
  }
  _renderSpinner(size, flag) {
    if (size === 0) {
      return
    } 
    else {
      return <Spinner visible={flag} color='black'/>
    }
  }
  _renderProfileInformation(uri) {
    return (
      <View style={CommonStyles.flexRowMarginBottom10}>
        <Image
          source={{uri: uri}}
          style={CommonStyles.galleryListViewProfileImage}/>
        {/*TODO: make inPhood below match our Logo*/}
        <Text style={CommonStyles.galleryListViewProfileName}>
          {this.state.result.first_name}'s inPhood
        </Text>
      </View>
    )
  }
  _renderListViewContent(flag, size) {
    if (flag) {
      return (
        <View style={CommonStyles.addPhotosMessage}>
          <Text>Loading photos...</Text>
        </View>
      )
    }
    else if (!size) {
      return (
        <View style={CommonStyles.addPhotosMessage}>
          <Text>Go to Camera tab to add photos...</Text>
        </View>
      )
    }
    else {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={this._renderSeparator}
        />
      )
    }
  }
  render() {
    console.log('View Rendered')
    let uri = this.state.result ? this.state.result.picture : ' '
    let size = this.props.galleryView.photos.length || this.props.galleryView.error !== ''
    let flag = this.props.galleryView.isLoading
     // && !this.props.galleryView.newUser
    return (
      <View style={CommonStyles.commonContainer}>
        {this._renderSpinner(size, flag)}
        {this._renderProfileInformation(uri)}
        {this._renderListViewContent(flag, size)}
      </View>
    )
  }
  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    let imgBlock = <Image style={CommonStyles.galleryListViewThumb} source={{uri: rowData.localFile}}/>
    if ((Date.now() - rowData.time)/1000 > 26400) {
      imgBlock = (
        <NetworkImage source={{uri: rowData.photo}}></NetworkImage>
      )
    }
    const data = rowData.data
    const path = '/global/' + data.uid + '/photoData/' + data.fileTail
    const imgSource = rowData.photo
    const mealType = rowData.mealType
    const mealTime = new Date(rowData.time).toDateString()
    const flag = this.props.notification.clientPhotos[imgSource]
    const notificationBlock = (
      <View style={CommonStyles.notificationView}>
        <Text style={CommonStyles.notificationText}>{flag}</Text>
      </View>
    )
    const showNotification = flag ? notificationBlock : <View />
    return (
      <View style={CommonStyles.galleryRow}>
        <View style={CommonStyles.flexRow}>
          <TouchableOpacity
            onPress={() => {
              this._pressRow(rowData.photo)
              highlightRow(sectionID, rowID)
            }}
          >
            {imgBlock}
          </TouchableOpacity>
        </View>
        <View style={CommonStyles.galleryText}>
          <Text style={CommonStyles.heavyFont}>
            {rowData.title}: {rowData.caption}
          </Text>
          <Text>
            {mealType}
          </Text>
          <View style={CommonStyles.flexRow}>
            <Text style={CommonStyles.italicFont}>
              {mealTime}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={CommonStyles.trashView}
          onPress={this._removeClientPhoto.bind(this, path)}>
          <Icon name="ios-trash-outline" size={30} color='red'/>
        </TouchableOpacity>
        {showNotification}
      </View>
    )
  }
  _pressRow(imgSource: string) {
    this.props._handleNavigate(route)
    this.props._setFeedback(imgSource)
  }
  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={
          adjacentRowHighlighted ? 
            CommonStyles.adjacentRowHighlightedSeparator : 
            CommonStyles.adjacentRowNotHighlightedSeparator
        }
      />
    )
  }
  _removeClientPhoto(path) {
    AlertIOS.alert(
     'Confirm Delete?',
     '',
     [
        {text: 'Cancel'},
        {text: 'Delete', 
        onPress: () => {
          console.log(path)
          this.props.removeClientPhoto(path)
        }, style: 'destructive'}
     ],
    )
  }
}
