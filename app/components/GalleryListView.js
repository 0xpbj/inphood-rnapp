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
} from 'react-native'

const route = {
  type: 'push',
  route: {
    key: 'selected',
    title: 'Confirm Photo'
  }
}

import TimerMixin from 'react-timer-mixin'
import Spinner from 'react-native-loading-spinner-overlay'
import PrettyDate from 'pretty-date'

export default class GalleryListView extends Component{
  constructor(props) {
    super(props)
    const mediaList = props.galleryView.photos
    this.state = {
      result: this.props.result,
      size: this.props.galleryView.photos.length,
      dataSource: this._createDataSource(mediaList),
      newUser: false,
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
      1000
    )
  }
  componentWillReceiveProps(nextProps) {
    const mediaList = nextProps.galleryView.photos
    this.setState({
      result: nextProps.result,
      size: nextProps.galleryView.photos.length,
      dataSource: this._createDataSource(mediaList),
      newUser: nextProps.galleryView.photos.length === 0 ? true : false
    })
  }
  render() {
    if (this.state.result === null) {
      alert ('Please Login')
      return (<View />)
    }
    else {
      let uri = this.state.result ? this.state.result.picture.data.url : ' '
      return (
        <View style={styles.container}>
          <Spinner
            visible={this.state.size === 0 && (!this.props.galleryView.newUser || !this.state.newUser)}
            color='black'
          />
          <View style={{flexDirection: 'row', marginBottom: 20}}>
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
  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    const imgSource = rowData.photo
    const mealData = rowData.mealData
    let mealType = ''
    if (mealData.breakfast) {
      mealType = 'Breakfast'
    }
    else if (mealData.lunch) {
      mealType = 'Lunch'
    }
    else if (mealData.dinner) {
      mealType = 'Dinner'
    }
    else if (mealData.snack){
      mealType = 'Snack'
    }
    const mealTime = new Date(rowData.time).toDateString()
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(imgSource)
          highlightRow(sectionID, rowID)
        }}>
        <View style={styles.row}>
          <Image style={styles.thumb} source={{uri: imgSource}} />
          <View  style={styles.text}>
            <Text style={{fontWeight: '600', fontSize: 18}}>
              {rowData.caption}
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
    marginTop: 64,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  profileImage: {
    marginLeft: 20,
    marginTop: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
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
})
