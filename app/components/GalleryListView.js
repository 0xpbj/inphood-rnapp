'use strict'

import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  Modal,
  Picker,
  ListView,
  Platform,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  RecyclerViewBackedScrollView
} from 'react-native'

import commonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'chat',
    title: 'Feedback'
  }
}

import NetworkImage from './NetworkImage'
import TimerMixin from 'react-timer-mixin'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/Ionicons'
// import RNFS from 'react-native-fs'

export default class GalleryListView extends Component{
  constructor(props) {
    super(props)
    const mediaList = props.galleryView.photos
    var photoNotifications = []
    for (let index in mediaList) {
      photoNotifications[mediaList[index].photo] = mediaList[index].notification
    }
    this.state = {
      mediaList: mediaList,
      result: this.props.result,
      size: mediaList.length,
      dataSource: this._createDataSource(mediaList),
      newUser: false,
      modalVisible: false,
      photoNotifications: photoNotifications,
    }
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  mixins: [TimerMixin]
  componentDidMount() {
    setTimeout(
      () => {
        this.setState({
        newUser: true,
        },
        () => {
          this.props.isNewUser(this.state.newUser)
        })
      },
      5000
    )
  }
  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.galleryView.photos
    var photoNotifications = []
    for (let index in mediaList) {
      photoNotifications[mediaList[index].photo] = mediaList[index].notification
    }
    this.setState({
      mediaList: mediaList,
      result: nextProps.result,
      size: mediaList.length,
      dataSource: this._createDataSource(mediaList),
      newUser: mediaList.length === 0 ? true : false,
      photoNotifications: photoNotifications,
    })
  }
  render() {
    if (this.state.result === null) {
      alert ('Please Login')
      return (<View />)
    }
    else {
      let uri = this.state.result ? this.state.result.picture : ' '
      let flag = this.state.size === 0 && (!this.props.galleryView.newUser || !this.state.newUser)
      if (flag) {
        return (
          <View style={commonStyles.commonContainer}>
            <Spinner
              visible={flag}
              color='black'
            />
            <View style={commonStyles.flexRowMarginBottom10}>
              <Image
                source={{uri: uri}}
                style={commonStyles.galleryListViewProfileImage}
              />
              <Text style={commonStyles.galleryListViewProfileName}>{this.state.result.first_name}'s InPhood</Text>
            </View>
          </View>
        )
      }
      else if (this.state.size === 0) {
        return (
          <View style={commonStyles.commonContainer}>
            <View style={commonStyles.flexRowMarginBottom10}>
              <Image
                source={{uri: uri}}
                style={commonStyles.galleryListViewProfileImage}
              />
              <Text style={commonStyles.galleryListViewProfileName}>{this.state.result.first_name}'s InPhood</Text>
            </View>
            <View style={commonStyles.addPhotosMessage}>
              <Text>Go to Camera tab to add photos...</Text>
            </View>
          </View>
        )
      }
      else {
        return (
          <View style={commonStyles.commonContainer}>
            <Spinner
              visible={flag}
              color='black'
            />
            <View style={commonStyles.flexRowMarginBottom10}>
              <Image
                source={{uri: uri}}
                style={commonStyles.galleryListViewProfileImage}
              />
              <Text style={commonStyles.galleryListViewProfileName}>{this.state.result.first_name}'s InPhood</Text>
            </View>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
              renderSeparator={this._renderSeparator}
            />
          </View>
        )
      }
    }
  }
  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    let imgBlock = <Image style={commonStyles.galleryListViewThumb} source={{uri: rowData.localFile}}/>
    if ((Date.now() - rowData.time)/1000 > 26400) {
      imgBlock = <NetworkImage source={{uri: rowData.photo}}/>
    }
    const imgSource = rowData.photo
    const mealType = rowData.mealType
    const mealTime = new Date(rowData.time).toDateString()
    const path = '/global/' + rowData.data.uid + '/photoData/' + rowData.data.fileTail
    const flag = this.state.photoNotifications[imgSource]
    const notificationBlock = ( <View style={commonStyles.notificationView}>
              <Text style={commonStyles.notificationText}> </Text>
            </View> )
    const showNotification = flag ? notificationBlock : <View />
    return (
        <View style={commonStyles.galleryRow}>
          <View style={commonStyles.flexRow}>
            <TouchableOpacity
              onPress={() => {
                this._pressRow(rowData.photo)
                highlightRow(sectionID, rowID)
              }}
            >
              {imgBlock}
            </TouchableOpacity>
            {showNotification}
          </View>
          <View style={commonStyles.galleryText}>
            <Text style={commonStyles.heavyFont}>
              {rowData.title}: {rowData.caption}
            </Text>
            <Text>
              {mealType}
            </Text>
            <View style={commonStyles.flexRow}>
              <Text style={commonStyles.italicFont}>
                {mealTime}
              </Text>
              <TouchableOpacity
                style={{marginLeft: 160}}
                onPress={this._setModalVisible.bind(this, true)}
              >
                <Icon name="ios-options-outline" size={20} color='black'/>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            animationType='none'
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {this._setModalVisible(false)}}
            >
            <View style={commonStyles.modalContainer}>
              <View style={[commonStyles.galleryListViewInnerContainer, {backgroundColor: '#fff', padding: 10}]}>
                <TouchableOpacity
                  onPress={this._removeClientPhoto.bind(this, path)}
                  style={[commonStyles.galleryListViewButton, commonStyles.modalButton]}
                >
                  <Text style={[commonStyles.galleryListViewButtonText, {color: 'red'}]}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this._setModalVisible.bind(this, false)}
                  style={[commonStyles.galleryListViewButton, commonStyles.modalButton]}
                >
                  <Text style={[commonStyles.galleryListViewButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
    )
  }
  _pressRow(imgSource: string) {
    let newNotifications = this.state.photoNotifications
    newNotifications[imgSource] = false
    this.setState({
      photoNotifications: newNotifications
    })
    this.props._handleNavigate(route)
    this.props._setFeedback(imgSource)
  }
  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={adjacentRowHighlighted ?
                commonStyles.adjacentRowHighlightedSeparator :
                commonStyles.adjacentRowNotHighlightedSeparator}
      />
    )
  }
  _removeClientPhoto(path) {
    this.props.removeClientPhoto(path)
    this.setState({modalVisible: false})
  }
  _setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
}
