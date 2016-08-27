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
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  componentWillMount() {
    const id = this.props.trainerData.clientId 
    const vals = this.props.trainerData.photos
    var data = []
    for (var key in vals) {
      if (vals[key][id])
        data.unshift(vals[key][id])
    }
    this.setState({dataSource: this._createDataSource(data)})
  }
  componentWillReceiveProps(nextProps) {
    const id = nextProps.trainerData.clientId 
    const vals = (nextProps.trainerData.photos)
    var data = []
    for (var key in vals) {
      if (vals[key][id])
        data.unshift(vals[key][id])
    }
    this.setState({dataSource: this._createDataSource(data)})
  }
  render() {
    let name = this.props.trainerData.clientName.split(' ')
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <Image
            source={{uri: this.props.trainerData.clientPhoto}}
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
  _renderRow(data: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    const imgSource = data.photo
    const imgBlock = <NetworkImage source={{uri: data.photo}}/>
    const mealType = data.mealType
    const mealTime = new Date(data.time).toDateString()
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(data.photo)
          highlightRow(sectionID, rowID)
        }}>
        <View style={styles.row}>
          {imgBlock}
          <View  style={styles.text}>
            <Text style={{fontWeight: '600', fontSize: 18}}>
              {data.title}: {data.caption}
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
    this.props.trainerFeedbackPhoto(imgSource)
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
    paddingBottom: 50,
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
