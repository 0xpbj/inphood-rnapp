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
import {sampleIcon} from './Icons'
// import RNFS from 'react-native-fs'

const IMAGE_PREFETCH_URL = 'http://facebook.github.io/origami/public/images/blog-hero.jpg?r=1&t=' + Date.now();
// var prefetchTask = Image.prefetch(IMAGE_PREFETCH_URL);

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
    }
  }
  mixins: [TimerMixin]
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
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
            <View style={{justifyContent: 'center', marginLeft: 20, marginTop: 150, flexDirection: 'row'}}>
              <Text>Go to </Text>
              <Image
                style={styles.button}
                source={{uri: sampleIcon.uri, scale: sampleIcon.scale}}
              />
              <Text> tab to add photos...</Text>
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
    let imgSource = rowData.photo
    var imgBlock = <NetworkImage source={{uri: rowData.photo}}/>
    // RNFS.exists(rowData.localFile)
    // .then((result) => {
    //   if (result) {
    //     imgSource = rowData.localFile
    //     imgBlock = <Image style={styles.thumb} source={{uri: rowData.localFile}}/>
    //   }
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
    const mealType = rowData.mealType
    const mealTime = new Date(rowData.time).toDateString()
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(imgSource)
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
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
