'use strict'

import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  Modal,
  Picker,
  ListView,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
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
import Config from '../constants/config-vars'

const turlHead = Config.AWS_CDN_THU_URL

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
  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.galleryView.photos
    this.setState({
      mediaList: mediaList,
      result: nextProps.result,
      dataSource: this._createDataSource(mediaList),
    })
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
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
          <Spinner visible={flag} color='black'/>
          <Text>Loading photos...</Text>
        </View>
      )
    }
    else if (!size) {
      return (
        <View style={CommonStyles.addPhotosMessage}>
          <Text>Swipe left to add photos...</Text>
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
          removeClippedSubviews={false}
        />
      )
    }
  }
  render() {
    let uri = this.state.result ? this.state.result.picture : ' '
    let size = this.props.galleryView.photos.length || this.props.galleryView.error !== ''
    let flag = this.props.galleryView.isLoading
    return (
      <View style={CommonStyles.commonContainer}>
        {this._renderProfileInformation(uri)}
        {this._renderListViewContent(flag, size)}
      </View>
    )
  }
  _renderRow(rowData, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    const {databasePath, mealType, localFile, title, caption, time, fileTail, fileName} = rowData
    const cdnPath = turlHead+fileName
    let imgBlock = ''
    if ((Date.now() - time) > 60000) {
      imgBlock = (
        <NetworkImage source={{uri: cdnPath}}></NetworkImage>
      )
    }
    else if (rowID === "0") {
      const backgroundColor = this.props.galleryView.pictureLoading ? 'rgba(255, 255, 255, 0.40)' : 'transparent'
      imgBlock = (
        <Image style={CommonStyles.galleryListViewThumb} source={{uri: localFile}}>
          <View style={{backgroundColor: backgroundColor, flex: 1}}>
            <View style={{flex: 1, backgroundColor: 'transparent'}}/>
            <ActivityIndicator
              animating={this.props.galleryView.pictureLoading}
              style={{
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'column',
                flex: 1
              }}
              color='black'
              size="large"
            />
            <View style={{flex: 1, backgroundColor: 'transparent'}}/>
          </View>
        </Image>
      )
    }
    else
      imgBlock = <Image style={CommonStyles.galleryListViewThumb} source={{uri: localFile}}/>
    const mealTime = new Date(time).toDateString()
    const flag = this.props.notification.galleryPhotos[databasePath]
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
              this._pressRow(databasePath, cdnPath)
              highlightRow(sectionID, rowID)
            }}
          >
            {imgBlock}
          </TouchableOpacity>
        </View>
        <View style={CommonStyles.galleryText}>
          <Text style={CommonStyles.heavyFont}>
            {title}: {caption}
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
          onPress={this._removeClientPhoto.bind(this, databasePath, fileTail)}>
          <Icon name="ios-trash-outline" size={30} color='red'/>
        </TouchableOpacity>
        {showNotification}
      </View>
    )
  }
  _pressRow(databasePath: string, cdnPath: string) {
    if (this.props.auth.authTrainer === 'pending' && this.props.auth.referralType === 'client') {
      Alert.alert(
       'Share data with your trainer: ' + this.props.auth.trainerName + '?',
       '',
       [
          {text: 'Accept',
          onPress: () => {
            this.props.setBranchAuthTrainer('accept')
          }, style: 'default'},
          {text: 'Decline',
          onPress: () => {
            this.props.setBranchAuthTrainer('decline')
          }, style: 'destructive'}
       ],
      )
    }
    this.props.markPhotoRead(databasePath, cdnPath)
    this.props._handleNavigate(route)
    this.props.feedbackPhoto(databasePath, cdnPath)
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
  _removeClientPhoto(databasePath, tail) {
    Alert.alert(
     'Confirm Delete?',
     '',
     [
        {text: 'Cancel'},
        {text: 'Delete',
        onPress: () => {
          this.props.removeClientPhoto(databasePath)
        }, style: 'destructive'}
     ],
    )
  }
}
