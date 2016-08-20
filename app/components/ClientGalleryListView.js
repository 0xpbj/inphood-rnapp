'use strict'

import React, {Component} from 'react'
import {
  Image,
  ListView,
  Platform,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  RecyclerViewBackedScrollView,
  Text,
  View,
  Picker,
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

export default class ClientGalleryListView extends Component{
  constructor(props) {
    super(props)
    this.state = {
      clientId: this.props._clientId,
      clientPhoto: this.props._clientPhoto,
      clientName: this.props._clientName,
      mediaList: '',
      dataSource: this._createDataSource([])
    }
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  componentWillUnmount() {
    this.clientRef.off()
  }
  componentWillMount() {
    this.getPhotos()
  }
  getPhotos() {
    this.clientRef = firebase.database().ref('/global/' + this.state.clientId + '/userData')
    this.clientRef.on('value', function(dataSnapshot){
      let photos = []
      dataSnapshot.forEach(function(childSnapshot) {
        childSnapshot.forEach(function(photoSnapshot) {
          if (photoSnapshot.key === 'immutable') {
            let item = photoSnapshot.val()
            // console.log(item)
            photos.push(item)
          }
        }.bind(this))
      }.bind(this))
      // console.log(photos)
      this.getData(photos)
    }.bind(this))
  }
  getData(photos) {
    let urlHead='http://dqh688v4tjben.cloudfront.net/data/'
    let turlHead='http://d2sb22kvjaot7x.cloudfront.net/resized-data/'
    // console.log(photos)
    let dataList = []
    for (let i = 0; i < photos.length; i++) {
      let thumb = turlHead+photos[i].fileName
      let photo = urlHead+photos[i].fileName
      let caption = photos[i].caption
      let title = photos[i].title
      let mealType = photos[i].mealType
      let time = photos[i].time
      let localFile = photos[i].localFile
      let obj = {photo,caption,mealType,time,title,localFile}
      dataList.push(obj)
    }
    console.log(dataList)
    this.setState({
      mediaList: dataList,
      dataSource: this._createDataSource(dataList)
    })
  }
  render() {
    let name = this.state.clientName.split(' ')
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <Image
            source={{uri: this.state.clientPhoto}}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{name[0]}'s InPhood</Text>
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
  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    const imgSource = rowData.photo
    const imgBlock = <NetworkImage source={{uri: rowData.photo}}/>
    const mealType = rowData.mealType
    const mealTime = new Date(rowData.time).toDateString()
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(rowData.photo)
          highlightRow(sectionID, rowID)
        }}>
        <View style={styles.row}>
          {imgBlock}
          <View  style={styles.text}>
            <Text style={{fontWeight: '600', fontSize: 18}}>
              {rowData.title}: {rowData.caption}
            </Text>
            <Text>
              {mealType}
            </Text>
            <Text style={{fontStyle: 'italic'}}>
              {mealTime}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  _pressRow(imgSource: string) {
    // this.props._handleNavigate(route)
    // this.props._setFeedback(imgSource)
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  profileImage: {
    marginLeft: 25,
    marginTop: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#006400',
  },
  profileName: {
    marginLeft: 20,
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
    height: 200,
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
    height: 28,
    width: 28,
    resizeMode: 'contain'
  }
})
