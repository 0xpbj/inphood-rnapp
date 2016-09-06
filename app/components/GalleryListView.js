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
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  RecyclerViewBackedScrollView
} from 'react-native'

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
    let mediaList = props.galleryView.photos
    let filter = this.props.galleryView.filter
    let filteredList = []
    if (filter === '') {
      let length = mediaList.length
      for (var i = 0; i < length; i++) {
        if (mediaList[i].mealType === filter) {
          filteredList.push(mediaList[i])
        }
      }
    }
    this.state = {
      mediaList: (filter === '') ? mediaList : filteredList,
      result: this.props.result,
      size: mediaList.length,
      dataSource: (filter === '') ? this._createDataSource(mediaList) : this._createDataSource(filteredList),
      newUser: false,
      filter: filter,
      modalVisible: false,
      photoFlags: []
    }
  }
  mixins: [TimerMixin]
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    return dataSource.cloneWithRows(list);
  }
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
    let filter = nextProps.galleryView.filter
    if (filter === '') {
      this.setState({
        mediaList: nextProps.galleryView.photos,
        result: nextProps.result,
        size: nextProps.galleryView.photos.length,
        dataSource: this._createDataSource(nextProps.galleryView.photos),
        newUser: nextProps.galleryView.photos.length === 0 ? true : false,
        filter: filter
      })
    }
    else {
      let mediaList = nextProps.galleryView.photos
      let length = mediaList.length
      let filteredList = []
      for (var i = 0; i < length; i++) {
        if (mediaList[i].mealType === filter) {
          filteredList.push(mediaList[i])
        }
      }
      this.setState({
        mediaList: filteredList,
        result: nextProps.result,
        size: nextProps.galleryView.photos.length,
        dataSource: this._createDataSource(filteredList),
        newUser: nextProps.galleryView.photos.length === 0 ? true : false,
        filter: filter
      })
    }
  }
  render() {
    if (this.state.result === null) {
      alert ('Please Login')
      return (<View />)
    }
    else {
      let uri = this.state.result ? this.state.result.picture.data.url : ' '
      let flag = this.state.size === 0 && (!this.props.galleryView.newUser || !this.state.newUser)
      if (flag) {
        return (
          <View style={styles.container}>
            <Spinner
              visible={flag}
              color='black'
            />
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Image
                source={{uri: uri}}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{this.state.result.first_name}'s InPhood</Text>
            </View>
          </View>
        )
      }
      else if (this.state.size === 0) {
        return (
          <View style={styles.container}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Image
                source={{uri: uri}}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{this.state.result.first_name}'s InPhood</Text>
            </View>
            <View style={{justifyContent: 'center', marginTop: 150, flexDirection: 'row'}}>
              <Text>Go to Camera tab to add photos...</Text>
            </View>
          </View>
        )
      }
      else {
        return (
          <View style={styles.container}>
            <Spinner
              visible={flag}
              color='black'
            />
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Image
                source={{uri: uri}}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{this.state.result.first_name}'s InPhood</Text>
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
    let imgBlock = <Image style={styles.thumb} source={{uri: rowData.localFile}}/>
    if ((Date.now() - rowData.time)/1000 > 26400) {
      imgBlock = <NetworkImage source={{uri: rowData.photo}}/>
    }
    const flag = rowData.notification
    const notificationBlock = ( <View style={styles.notification}>
              <Text style={styles.notificationText}> </Text>
            </View> )
    const imgSource = rowData.photo
    const mealType = rowData.mealType
    const mealTime = new Date(rowData.time).toDateString()
    const path = '/global/' + rowData.data.uid + '/photoData/' + rowData.data.fileTail
    const showNotification = flag ? notificationBlock : <View />
    return (
        <View style={styles.row}>
          <View style={{flexDirection: 'row'}}>
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
          <View style={styles.text}>
            <Text style={{fontWeight: '600', fontSize: 18}}>
              {rowData.title}: {rowData.caption}
            </Text>
            <Text>
              {mealType}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontStyle: 'italic'}}>
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
            <View style={styles.modalContainer}>
              <View style={[styles.innerContainer, {backgroundColor: '#fff', padding: 10}]}>
                <TouchableOpacity
                  onPress={this._removeClientPhoto.bind(this, path)}
                  style={[styles.button, styles.modalButton]}
                >
                  <Text style={[styles.buttonText, {color: 'red'}]}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this._setModalVisible.bind(this, false)}
                  style={[styles.button, styles.modalButton]}
                >
                  <Text style={[styles.buttonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  profileImage: {
    marginLeft: 20,
    marginTop: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#006400',
  },
  profileName: {
    marginLeft: 40,
    marginTop: 42,
    fontSize: 18,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 300,
    height: 330,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    borderColor: 'black',
    borderStyle: 'solid'
  },
  picker: {
    width: 100,
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    // alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  notification: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 25,
  },
  notificationText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'red',
    fontWeight: 'bold',
  },
})
