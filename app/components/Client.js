import React, {
  Component
} from "react";
import {
  Image,
  View,
  Text,
  ListView,
  Platform,
  StyleSheet,
  BackAndroid,
  TouchableHighlight,
  NavigationExperimental,
  RecyclerViewBackedScrollView,
} from 'react-native'

import CommonStyles from './styles/common-styles'

const route = {
  type: 'push',
  route: {
    key: 'client',
    title: 'Client Photos'
  }
}

export default class Client extends Component {
  constructor(props) {
    super(props)
    this._createDataSource(this.props.trainerData.infos)
    this.state = {dataSource: this._createDataSource(this.props.trainerData.infos)}
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({dataSource: this._createDataSource(nextProps.trainerData.infos)})
  }
  componentWillMount() {
    this.setState({dataSource: this._createDataSource(this.props.trainerData.infos)})
  }
  render() {
    return (
      <View style={CommonStyles.commonContainer}>
        <Text style={CommonStyles.clientProfileName}>Client's InPhood</Text>
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
    const data = rowData.data
    const clientId = rowData.id
    const clientImage = <Image style={CommonStyles.clientProfileImage} source={{uri: data.val().picture}}/>
    const clientName = data.val().name
    const notificationBlock = ( 
      <View style={CommonStyles.notificationView}>
        <Text style={CommonStyles.notificationText}>12</Text>
      </View>
    )
    const showNotification = notificationBlock
    return (
      <View>
        <TouchableHighlight onPress={() => {
            this._pressRow(clientId, data.val().picture, clientName)
            highlightRow(sectionID, rowID)
          }}>
          <View style={CommonStyles.commonRow}>
            {clientImage}
            <View  style={CommonStyles.commonView}>
              <Text style={CommonStyles.clientNameText}>
                {clientName}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        {showNotification}
      </View>
    )
    // return <View />
  }
  _pressRow(clientId: string, clientPhoto: string, clientName: string) {
    this.props.setClientId(clientId)
    this.props.setClientPhoto(clientPhoto)
    this.props.setClientName(clientName)
    this.props._handleNavigate(route)
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
