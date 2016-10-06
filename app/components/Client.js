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
import Spinner from 'react-native-loading-spinner-overlay'

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
    this.state = {dataSource: this._createDataSource(this.props.trainer.infos)}
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({dataSource: this._createDataSource(nextProps.trainer.infos)})
  }
  componentWillMount() {
    this.setState({dataSource: this._createDataSource(this.props.trainer.infos)})
  }
  render() {
    let flag = this.props.trainer.infos.length === 0
    if (flag) {
      return <Spinner visible={flag} color='black'/>
    }
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
    const data = rowData.child
    const clientId = rowData.id
    const clientImage = <Image style={CommonStyles.clientProfileImage} source={{uri: data.picture}}/>
    const clientName = data.name
    const flag = this.props.notification.clientUID[clientId]
    const notificationBlock = ( 
      <View style={CommonStyles.notificationView}>
        <Text style={CommonStyles.notificationText}>{flag}</Text>
      </View>
    )
    const showNotification = flag ? notificationBlock : <View />
    return (
      <View>
        <TouchableHighlight onPress={() => {
            this._pressRow(clientId, data.picture, clientName)
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
