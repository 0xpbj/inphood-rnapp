import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Picker,
  TouchableHighlight
} from 'react-native'
import Button from './Button'

const route = {
  type: 'push',
  route: {
    key: 'caption',
    title: 'Write a Caption'
  }
}

const Selected = ({_selectedPhoto, _handleNavigate}) => (
  <View style={styles.container}>
    <Image
        style={styles.gif}
        source={{uri: _selectedPhoto}}
      />
    <Button onPress={()=>_handleNavigate(route)} label='Next'/>
  </View>
)

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    paddingTop: 65,
  },
  gif: {
    height: 335,
  },
  default: {
    height: 80,
    borderWidth: 1.5,
    borderColor: 'black',
    flex: 1,
    fontSize: 20,
    padding: 4,
  },
})

export default Selected
