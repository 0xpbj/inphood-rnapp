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

const route = {
  type: 'push',
  route: {
    key: 'client',
    title: 'Client Photos'
  }
}

export default class ExpertGalleryListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      clientInfo: [],
      dataSource: this._createDataSource([])
    }
  }
  componentWillMount() {
    this.getClients()
  }
  componentWillUnmount() {
    this.trainerRef.off()
    for (let i = 0; i < this.clientsRef.length; i++) {
      this.clientsRef[i].off()
    }
  }
  _createDataSource(list) {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => true,
    });
    return dataSource.cloneWithRows(list);
  }
  getClients() {
    let user = firebase.auth().currentUser
    this.trainerRef = firebase.database().ref('/global/' + user.uid + '/trainerInfo/clientId')
    this.trainerRef.on('value', function(dataSnapshot) {
      let clients = []
      dataSnapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val()
        item['.key'] = childSnapshot.key
        clients.push(item)
      }.bind(this))
      this.setState({
        clients: clients
      })
      this.getClientPhotos(clients)
    }.bind(this))
  }
  getClientPhotos(clients) {
    this.clientsRef = []
    let clientInfo = []
    for (let i = 0; i < clients.length; i++) {
      this.clientsRef[i] = firebase.database().ref('/global/' + clients[i] + '/userInfo/public')
      this.clientsRef[i].once('value')
      .then(function(dataSnapshot){
        let name = ''
        let picture = ''
        let gender = ''
        let clientId = clients[i]
        dataSnapshot.forEach(function(childSnapshot) {
          if (childSnapshot.key === 'name') {
            name = childSnapshot.val()
          }
          else if (childSnapshot.key === 'picture') {
            picture = childSnapshot.val()
          }
          else if (childSnapshot.key === 'physicals') {
            childSnapshot.forEach(function(physicalSnapshot) {
              gender = physicalSnapshot.val()
            })
          }
        }.bind(this))
        let item = {name, picture, gender, clientId}
        clientInfo.push(item)
        if (i === clients.length - 1) {
          this.setState({
            clientInfo: clientInfo,
            dataSource: this._createDataSource(clientInfo)
          })
        }
      }.bind(this))
    }
  }
  render() {
    // console.log(this.state.clientInfo)
    return (
      <View>
        <Text style={styles.profileName}>Client's InPhood</Text>
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
    let clientImage = <Image style={styles.profileImage} source={{uri: rowData.picture}}/>
    let clientName = rowData.name
    let clientGender = rowData.gender
    let clientId = rowData.clientId
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(clientId, rowData.picture, clientName)
          highlightRow(sectionID, rowID)
        }}>
        <View style={styles.row}>
          {clientImage}
          <View  style={styles.text}>
            <Text style={{fontWeight: '600', fontSize: 18}}>
              {clientName}
            </Text>
            <Text style={{fontStyle: 'italic'}}>
              {clientGender}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  _pressRow(clientId: string, clientPhoto: string, clientName: string) {
    this.props._setClientId(clientId)
    this.props._setClientPhoto(clientPhoto)
    this.props._setClientName(clientName)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  profileName: {
    justifyContent: 'center',
    marginLeft: 90,
    marginTop: 30,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold'
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 10,
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
