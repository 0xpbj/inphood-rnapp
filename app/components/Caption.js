import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  Switch,
  Platform,
  TextInput,
  Picker,
  Dimensions,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native'

import Button from './Button'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonStyles from './styles/common-styles'

var { width, height } = Dimensions.get('window');

export default class Caption extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animating: false,
      meal: false,
      recipe: false,
      breakfast: false,
      lunch: false,
      dinner: false,
      snack: false,
      caption: '',
      color: 'grey',
      hideKeyboard: false
    }
    this._workBeforeTransition = this._workBeforeTransition.bind(this)
  }
  _searchNutritionLevel1(tag) {
    // "Abridged (common American) data for Food Groups:
    //    Baked Products; Breakfast Cereals; Cereal Grains and Pasta;
    //    Fats and Oils; Fruits and Fruit Juices; Legumes and Legume Products;
    //    Nut and Seed Products; Spices and Herbs;
    //    Vegetables and Vegetable Products"
    const fruitAndVegData = require('../data/nutrients.001.opt.json')
    console.log('after require ...')
    // AC TODO:

    // let data = ''
    // const filePath = '../data/nutrients.001.csv'
    //
    // // encoding, should be one of `base64`, `utf8`, `ascii`
    // // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
    // // when reading file in BASE64 encoding, buffer size must be multiples of 3.
    // RNFetchBlob.fs.readStream(filePath, 'utf8', 1023)
    //   .then((ifstream) => {
    //       ifstream.open()
    //       ifstream.onData((chunk) => {data += chunk})
    //       ifstream.onError((err) => {console.log('oops', err)})
    //       ifstream.onEnd(() => {
    //         console.log('success reading ', filePath)
    //         // You can use the 'data' variable in here ...
    //       })
    //   })
    //
  }
  _nutritionFun(text) {
    console.log('Nutrition Fun!')
    console.log('-----------------------------------------------------')
    console.log(text)
    var tags = text.split(", ");
    // Aparently Array.forEach is hella slow (https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead)
    // so use regular for loop:
    for (var i = 0, lengthTags = tags.length; i < lengthTags; i++) {
      console.log("Processing: ", tags[i])
      this._searchNutritionLevel1(tags[i])
    }
    // For each item in text ...
    //  search our nutrition data files
    //    if match:
    //      print nutrition data, source file etc.
    //      sum nutrition values in meal-title nutrition catch all
    //    if no match:
    //      print not found
    //
  }
  _workBeforeTransition(text) {
    this._nutritionFun(text)

    const {meal, recipe, breakfast, lunch, dinner, snack} = this.state
    let mealType = ''
    if (breakfast) {
      mealType = 'Breakfast'
    }
    else if (lunch) {
      mealType = 'Lunch'
    }
    else if (dinner) {
      mealType = 'Dinner'
    }
    else if (snack){
      mealType = 'Snack'
    }
    this.props.storeCaption(text)
    this.props.addMealData(mealType)
    this.props.sendFirebaseInitCamera()
  }
  componentWillMount() {
    const time = new Date().getHours()
    if (time < 11) {
      this.setState({
        breakfast: true,
        lunch: false,
        dinner: false,
        snack: false,
      })
    }
    else if (time < 14) {
      this.setState({
        breakfast: false,
        lunch: true,
        dinner: false,
        snack: false,
      })
    }
    else if (time < 18) {
      this.setState({
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: true,
      })
    }
    else if (time < 24) {
      this.setState({
        breakfast: false,
        lunch: false,
        dinner: true,
        snack: false,
      })
    }
  }
  _renderImage() {
    return (
      <View
        style={[CommonStyles.selectedImage,
                CommonStyles.universalMargin]}>
        <Image
          style={[{flex:1},
                  CommonStyles.universalBorderRadius]}
          resizeMode='cover'
          source={{uri: this.props.selected.photo}}/>
      </View>
    )
  }
  _renderSpinner() {
    return (
      <View>
        <Spinner color='black' overlayColor='rgba(0, 0, 0, 0)' visible={this.props._inProgress} />
      </View>
    )
  }
  _renderTextInput(textInputAutoFocus) {
    let whiteSpace = new RegExp(/^\s+$/)
    const defaultValue = this.props.vision.tags
    const placeholder = this.props.vision.tags === '' ? "Ingredients, e.g.: Beef, Tomatoes ..." : ''
    const selectionColor = this.props.vision.tags === '' ? '' : 'blue'
    const clearButtonMode = this.props.vision.tags === '' ? 'while-editing' : 'always'

    return (
      <TextInput
        style={[CommonStyles.singleSegmentView,
                CommonStyles.universalFontSize]}
        autoCapitalize="none"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoFocus={textInputAutoFocus}
        clearButtonMode={clearButtonMode}
        returnKeyType="done"
        onSubmitEditing={
          (event) => {
            let text = event.nativeEvent.text
            if (text === '') {
              alert ('Please enter ingredients')
            }
            else if (whiteSpace.test(text)) {
              alert ('Please enter proper ingredients')
            }
            else {
              this._workBeforeTransition(text)
            }
          }
        }
      />
    )
  }
// Begin AC Keyboard madness example for PBJ:
//
  _renderCustomKey(flexSize, textContent) {
    return (
      <View style={{flex: flexSize, flexDirection: 'column'}}>
        <View style={{flex: 1, margin: 10, borderWidth: 1, borderColor: 'black', borderRadius: 4}}>
          <Text style={{flex: 1, justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center', textAlignVertical: 'center'}}>
            {textContent}
          </Text>
        </View>
      </View>
    )
  }
  _renderSpacer(flexSize) {
    return <View style={{flex: flexSize}}/>
  }
  _renderKey() {
    return(
      <View style={{flexDirection: 'column', flex: 1,
                    justifyContent: 'center', alignItems: 'center'}}>
      {/*If we make the TouchableHighlight flex: 1, the pressable area is bigger
         vertically--skipping that for now though.*/}
      <TouchableHighlight style={{justifyContent: 'center', alignItems: 'center',
                                  borderWidth: 1, borderColor: 'black', borderRadius: 4, padding: 5}}>
        <Icon
          size={35}
          name={"ios-keypad-outline"}/>
      </TouchableHighlight>
      </View>
    )
  }
  _renderACBoard() {
    var row1 = []
    for (var i = 0; i < 10; i++) {
      row1.push(this._renderKey())
    }

    var row2 = []
    row2.push(this._renderSpacer(0.5))
    for (var i = 0; i < 9; i++) {
      row2.push(this._renderKey())
    }
    row2.push(this._renderSpacer(0.5))

    var row3 = []
    row3.push(this._renderSpacer(1))
    for (var i = 0; i < 8; i++) {
      row3.push(this._renderKey())
    }
    row3.push(this._renderSpacer(1))

    var row4 = []
    row4.push(this._renderCustomKey(2, 'kbd'))
    row4.push(this._renderSpacer(1))
    row4.push(this._renderCustomKey(4, 'space'))
    row4.push(this._renderSpacer(0.5))
    row4.push(this._renderCustomKey(2.5, 'return'))

    return(
      <View style={{flex: 1}}>
        <TextInput style={{flex: 1}}/>
        <View style={{flex: 4}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {row1}
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {row2}
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {row3}
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {row4}
          </View>
        </View>
      </View>
    )
  }
  _renderKeyboard() {
    return (
      <View style={[CommonStyles.keyboardInputView]}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight
            onPress={()=>{
              this.setState({
                hideKeyboard: !this.state.hideKeyboard
              })
            }}>
            <Icon
              name={"ios-keypad-outline"}
              size={26}
              style={CommonStyles.keyboardIcon}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  _renderIOS() {
    return (
      // This view divides the screen into 17 segments.  The bottom 8 segments
      // are left blank for the keyboard.
      <KeyboardAvoidingView behavior='padding' style={CommonStyles.flexContainer}>
        {this._renderImage()}
        {this._renderSpinner()}
        {/*Need this View wrapping TextInput to support single sided border
          text input line.*/}
        <KeyboardAvoidingView behavior='padding'
          style={[CommonStyles.singleSegmentView,
                  CommonStyles.universalInputView,
                  CommonStyles.universalMargin]}>
          {this._renderTextInput(true)}
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
    )
  }
  _renderAndroid() {
    const keyboard = this.state.hideKeyboard ? (
      <View
        style={{flex: 5}}>
        {this._renderACBoard()}
      </View>
    ) :
    (
      <View
        style={[CommonStyles.singleSegmentView,
                CommonStyles.universalInputView,
                CommonStyles.universalMargin]}>
        {this._renderTextInput(!this.state.hideKeyboard)}
      </View>
    )
    return (
      // This view divides the screen into 17 segments.  The bottom 8 segments
      // are left blank for the keyboard.
      <View style={CommonStyles.flexContainer}>
        <View style={{flex: 4}}>
          {this._renderImage()}
        </View>
        {this._renderSpinner()}
        {/*Need this View wrapping TextInput to support single sided border
          text input line.*/}
        <View
          style={{flex: 5}}>
          {this._renderACBoard()}
        </View>
      </View>
    )
  }
  render() {
    // Same issue and code as in Selected.js (TODO: less c+p)
    //
    // TODO: This is really a hack/workaround for 1.5 Android, but there are a number of
    //       problems:
    //         - Android's keyboard doesn't lose focus when you click on the picture
    //           which usually causes the keyboard to drop down and the picture
    //           to become larger.
    //         - There are nested KeyboardAvoidingViews below--not sure if this is
    //           recommended or causes flicker. A fix is not straightforward either
    //           as there are issues with the text bar disappearing etc.
    //       When time permits this needs to be restyled.
    // return (Platform.OS === 'ios' ? this._renderIOS() : this._renderAndroid())
    return this._renderAndroid()
  }
}
