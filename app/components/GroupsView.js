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
  TouchableHighlight,
  RecyclerViewBackedScrollView,
} from 'react-native'

import CommonStyles from './styles/common-styles'
import Spinner from 'react-native-loading-spinner-overlay'

export default class GroupsView extends Component {
  constructor(props) {
    super(props)
    this.state = {dataSource: this._createDataSource(this.props.groups.infos)}
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({dataSource: this._createDataSource(nextProps.groups.infos)})
  }
  componentWillMount() {
    this.setState({dataSource: this._createDataSource(this.props.groups.infos)})
  }
  render() {
    let flag = this.props.groups.infos.length === 0
    if (flag) {
      return <Spinner visible={flag} color='black'/>
    }
    return (
      <View style={CommonStyles.commonContainer}>
        <Text style={CommonStyles.groupProfileName}>inPhood Groups</Text>
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
    const groupName = rowData.name
    const picture = rowData.picture
    const groupImage = <Image style={CommonStyles.groupProfileImage} source={{uri: picture}}/>
    const flag = this.props.notification.groupArr[groupName]
    const notificationBlock = ( 
      <View style={CommonStyles.notificationView}>
        <Text style={CommonStyles.notificationText}>{flag}</Text>
      </View>
    )
    const showNotification = flag ? notificationBlock : <View />
    return (
      <View>
        <TouchableHighlight onPress={() => {
            this._pressRow(groupName, picture)
            highlightRow(sectionID, rowID)
          }}>
          <View style={CommonStyles.commonRow}>
            {groupImage}
            <View  style={CommonStyles.commonView}>
              <Text style={CommonStyles.groupNameText}>
                {groupName}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        {showNotification}
      </View>
    )
  }
  _pressRow(groupName: string, groupPicture: string) {
    const route = {
      type: 'push',
      route: {
        key: 'photos',
        title: groupName + ' Group Photos'
      }
    }
    this.props.setGroupName(groupName, groupPicture)
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
