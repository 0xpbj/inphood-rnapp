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

const Caption = ({_transmit, _selectedPhoto, _storeCaption, _handleBackAction}) => (
  <View style={styles.container}>
    <View style={{flexDirection: 'row'}}>
      <TextInput
        autoCapitalize="none"
        placeholder="Describe your meal..."
        returnKeyType="done"
        onSubmitEditing={(event) => _storeCaption(event.nativeEvent.text)}
        style={styles.default}
      />
      <TouchableHighlight onPress={_handleBackAction}>
        <Image
          style={styles.gif}
          source={{uri: _selectedPhoto}}
        />
      </TouchableHighlight>
    </View>
    <Picker style={{paddingBottom: 40}} >
      <Picker.Item label="Breakfast" value="Breakfast" />
      <Picker.Item label="Lunch" value="Lunch" />
      <Picker.Item label="Snack" value="Snack" />
      <Picker.Item label="Dinner" value="Dinner" />
    </Picker>
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
    paddingTop: 65,
    flexDirection: 'column',
  },
  gif: {
    width: 80,
    height: 80,
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

export default Caption
