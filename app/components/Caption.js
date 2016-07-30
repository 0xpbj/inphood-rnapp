import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput
} from 'react-native'
import Button from './Button'

const Caption = ({_transmit, _selectedPhoto, _storeCaption}) => (
  <View style={styles.container}>
    <Image
      style={styles.gif}
      source={{uri: _selectedPhoto}}
    />
    <TextInput
      autoCapitalize="none"
      placeholder="Describe your meal"
      returnKeyType="done"
      onSubmitEditing={(event) => _storeCaption(event.nativeEvent.text)}
      style={styles.default}
    />
    <Button onPress={_transmit} label='Send'/>
  </View>
)

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    paddingTop: 20
  },
  gif: {
    flex: 2,
    height: 340,
  },
  default: {
    height: 40,
    borderWidth: 0.5,
    borderColor: '#3b5998',
    flex: 1,
    fontSize: 20,
    padding: 4,
  },
})

export default Caption
