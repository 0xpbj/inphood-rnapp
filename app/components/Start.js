/* @flow */

'use strict'

import React, { Component } from "react"
import {
  View,
  Text,
  Alert,
  Modal,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  ScrollView,
  NativeModules,
  TouchableHighlight,
} from "react-native"

import Swiper from 'react-native-swiper'

import Icon from 'react-native-vector-icons/Ionicons'
import FacebookLogin from './FacebookLogin'
import EmailLogin from './EmailLogin'
import Spinner from 'react-native-loading-spinner-overlay'
import Communications from 'react-native-communications'
import DeviceInfo from 'react-native-device-info'
import CommonStyles from './styles/common-styles'

const loginRoute = {
  type: 'push',
  route: {
    key: 'login',
    title: 'Email Login'
  }
}

const signUpRoute = {
  type: 'push',
  route: {
    key: 'signup',
    title: 'User Signup'
  }
}

const settingsRoute = {
  type: 'push',
  route: {
    key: 'settings',
    title: 'User Settings'
  }
}

// const groupRoute = {
//   type: 'push',
//   route: {
//     key: 'creategroup',
//     title: 'Create a group'
//   }
// }

const windowSize = Dimensions.get('window')
const launchImageSize = {width: windowSize.width, height: windowSize.height}
const sliderImageSize = {width: windowSize.width, height: windowSize.height}
const sliderImageResizeMode = 'stretch'

export default class Start extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: null,
      height: null,
      modalVisible: false,
    }
  }
  clientAppInvite() {
    this.props.sendClientAppInvite()
  }
  friendAppInvite() {
    this.props.sendFriendAppInvite()
  }
  userSettings() {
    this.props._handleNavigate(settingsRoute)
  }
  // createGroup() {
  //   this.props._handleNavigate(groupRoute)
  // }
  sendEmail() {
    const deviceData = '\n\n\n\n\n\n'
                     + '\nDevice Manufacturer: ' + DeviceInfo.getManufacturer()
                     + '\nDevice Brand: ' + DeviceInfo.getBrand() 
                     + '\nDevice Model: ' + DeviceInfo.getModel()
                     + '\nDevice ID: ' + DeviceInfo.getDeviceId()
                     + '\nSystem Name: ' + DeviceInfo.getSystemName()
                     + '\nSystem Version: ' + DeviceInfo.getSystemVersion()
                     + '\nBundle ID: ' + DeviceInfo.getBundleId()
                     + '\nBuild Number: ' + DeviceInfo.getBuildNumber()
                     + '\nApp Version: ' + DeviceInfo.getVersion()
                     + '\nApp Version (Readable): ' + DeviceInfo.getReadableVersion()
                     + '\nUser Agent: ' + DeviceInfo.getUserAgent()
                     + '\nDevice Locale: ' + DeviceInfo.getDeviceLocale()
                     + '\nDevice Country: ' + DeviceInfo.getDeviceCountry()
                     + '\nApp Instance ID: ' + DeviceInfo.getInstanceID()
    // console.log(deviceData)
    Communications.email(['support@inphood.com'],null,null,'Need Help',deviceData)
  }
  render() {
    console.log("Device Unique ID", DeviceInfo.getUniqueID())

    if (this.props.auth.inProgress) {
      return this.launchScreen()
    }
    else if (this.props.auth.result === null) {
      return (
        <View style={{flex: 1}}>
          {this.flipBoard()}
          {/*{this.anonymousButton()}
          {this.loginOutButton()}
          {this.modalLoginOutDialog()}*/}
        </View>
      )
    }
    else {
      // The layout here starts with a View (extrasButtonContainer),
      // containing 3 columns of 1/4, 1/2, and 1/4 width.  The 1/2
      // width button contains the buttons (and determines their width).
      // Alignment is performed with justifyContent and alignItems. The only
      // absolute values are the height of the buttons and the margin, padding,
      // and border values.
      //
      // Each button is comprised of a spacer, an icon, and button text. The
      // weight of these elements for flex are 1:1:4, this achieves left
      // justification of button text with reasonable icon to left-edge spacing
      // within the button.
      //
      return (
        <View style={CommonStyles.extrasButtonContainer}>
            {this.flexOneSpacerView()}
            <View style={{flex: 2}}>
              {this.profileImageButton()}
              {this.helpEmailButton()}
              {this.userSettingsButton()}
              {this.clientAppInviteButton()}
              {this.friendAppInviteButton()}
              {this.logOutButton()}
            </View>
            {this.flexOneSpacerView()}
        </View>
      )
    }
  }
  _emailLogin() {
    this._setModalVisible(false)
    this.props._handleNavigate(loginRoute)
  }
  _signUp() {
    this._setModalVisible(false)
    this.props._handleNavigate(signUpRoute)
  }
  _emailLogout() {
    this.props.logoutRequest()
  }
  _setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }
  _initAnonymousLogin() {
    this.props.anonymousLogin()
  }
  launchScreen() {
    return (
      <View>
        <Spinner
          visible={true}
          color='black'
          overlayColor='rgba(0, 0, 0, 0)'
        />
        <Image
          source={require('./img/HD_5_5.png')}
          style={[launchImageSize, CommonStyles.containerImage]}>
        </Image>
      </View>
    )
  }
  flipBoardCaption(captionLocation, captionText) {
    const onePercentWidth = windowSize.width / 100
    const onePercentHeight = windowSize.height / 100
    const captionWidth = 60 * onePercentWidth
    const captionHeight = 20 * onePercentHeight
    const resolvedCaptionLocation = {top: captionLocation.top * onePercentHeight,
                                     left: captionLocation.left * onePercentWidth}
    const orangeRedTransluscent = 'rgba(255, 64, 0, 0.75)'

    // TODO: Algorithm to scale the font based on screen size / pixel density
    // (Presently if the screen is longer, the font won't fill the caption as
    // far down and the caption bottom may not intersect items of interest.)

    return(
      <View
        style={[{width: captionWidth,
                backgroundColor: orangeRedTransluscent,
                padding: 10,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 8,},
                resolvedCaptionLocation]}>
        <Text
          style={{fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white'}}>
          {captionText}</Text>
      </View>
    )
  }
  flipBoard() {
    const pageOneCaptionLocation = Platform.OS === "ios" ?
                                   {top: 15, left: 20} :
                                   {top: 20, left: 20}
    const pageOneCaptionText = '1. Take a photo of a meal.'
    const pageTwoCaptionLocation = Platform.OS === "ios" ?
                                   {top: 60, left: 20} :
                                   {top: 55, left: 20}
    const pageTwoCaptionText = '2. Give it a title.'
    const pageThreeCaptionLocation = Platform.OS === "ios" ?
                                     {top: 60, left: 35} :
                                     {top: 55, left:35}
    const pageThreeCaptionText = '3. Describe it\'s ingredients.'
    const pageFourCaptionLocation = Platform.OS === "ios" ?
                                    {top: 43, left: 20} :
                                    {top: 48, left: 20}
    const pageFourCaptionText = '4. Your trainer sees the photo & description.'
    const pageFiveCaptionLocation = Platform.OS === "ios" ?
                                    {top: 60, left: 20} :
                                    {top: 45, left: 20}
    const pageFiveCaptionText = '5. Discuss the meal with your trainer.'

    // Conditional style below for require done this way b/c require doesn't
    // permit variable or const var input.
    return (
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <Swiper
          autoplay={true}
          loop={false}
          autoplaytimeout={4.5}>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode}
                   style={sliderImageSize}
                   source={ (Platform.OS === "ios" ?
                             require('./img/f1.png') :
                             require('./img/ae1.png')) }>
            {this.flipBoardCaption(pageOneCaptionLocation, pageOneCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode}
                 style={sliderImageSize}
                 source={ (Platform.OS === "ios" ?
                           require('./img/f2.png') :
                           require('./img/ae2.png')) }>
            {this.flipBoardCaption(pageTwoCaptionLocation, pageTwoCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode}
                 style={sliderImageSize}
                 source={ (Platform.OS === "ios" ?
                           require('./img/f3.png') :
                           require('./img/ae3.png')) }>
            {this.flipBoardCaption(pageThreeCaptionLocation, pageThreeCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <Image resizeMode={sliderImageResizeMode}
                 style={sliderImageSize}
                 source={ (Platform.OS === "ios" ?
                           require('./img/f4.png') :
                           require('./img/ae4.png')) }>
            {this.flipBoardCaption(pageFourCaptionLocation, pageFourCaptionText)}
            </Image>
          </View>
          <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <View style ={{flex: 8}}>
            <Image resizeMode={sliderImageResizeMode}
                 style={sliderImageSize}
                 source={ (Platform.OS === "ios" ?
                           require('./img/f5.png') :
                           require('./img/ae5.png')) }>
            {this.flipBoardCaption(pageFiveCaptionLocation, pageFiveCaptionText)}
            </Image>
            </View>
            {this.anonymousButton()}
          </View>
        </Swiper>
      </View>
    )
  }
  anonymousButton() {
    const buttonText =  this.props.auth.result ? 'Log Out' : 'Try App'
    const offsetFromBottom = windowSize.height / 10
    return (
      <View style={{alignItems: 'center'}}>
        <View style={{bottom: offsetFromBottom,
                      width: 200,
                      backgroundColor: 'rgba(127, 127, 127, 0.4)',
                      alignItems: 'center',
                      paddingRight: 10,
                      paddingLeft: 10,
                      borderRadius: 4,}}>
          <TouchableHighlight
            style={CommonStyles.cancelButton}
            underlayColor='#99d9f4'
            onPress={this._initAnonymousLogin.bind(this)}>
            <Text style={CommonStyles.buttonText}>{buttonText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  loginOutButton() {
    const buttonText =  this.props.auth.result ? 'Log Out' : 'Log In'
    const offsetFromBottom = windowSize.height / 10
    return (
      <View style={{alignItems: 'center'}}>
        <View style={{bottom: offsetFromBottom,
                      width: 200,
                      backgroundColor: 'rgba(127, 127, 127, 0.4)',
                      alignItems: 'center',
                      paddingRight: 10,
                      paddingLeft: 10,
                      borderRadius: 4,}}>
          <TouchableHighlight
            style={CommonStyles.button}
            underlayColor='#99d9f4'
            onPress={this._setModalVisible.bind(this,true)}>
            <Text style={CommonStyles.buttonText}>{buttonText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  modalFacebookLoginButton() {
    return (
      <FacebookLogin
        auth={this.props.auth}
        storeResult={this.props.storeResult}
        storeError={this.props.storeError}
        loginRequest={this.props.loginRequest}
        logoutRequest={this.props.logoutRequest}
        loginError={this.props.loginError}
        storeToken={this.props.storeToken}
        _setModalVisible={this._setModalVisible.bind(this)}/>
    )
  }
  modalEmailLoginButton() {
    return (
      <TouchableHighlight
        style={CommonStyles.button}
        underlayColor='#99d9f4'
        onPress={this._emailLogin.bind(this)}>
        <Text style={CommonStyles.buttonText}>Log in with Email</Text>
      </TouchableHighlight>
    )
  }
  modalSignUpButton() {
    return (
      <TouchableHighlight
        style={CommonStyles.button}
        underlayColor='#99d9f4'
        onPress={this._signUp.bind(this)}>
        <Text style={CommonStyles.buttonText}>Sign Up</Text>
      </TouchableHighlight>
    )
  }
  modalCancelLoginButton() {
    return (
      <TouchableHighlight
        onPress={this._setModalVisible.bind(this, false)}
        style={CommonStyles.cancelButton}>
        <Text style={CommonStyles.buttonText}>Cancel</Text>
      </TouchableHighlight>
    )
  }
  modalLoginOutDialog() {
    return (
      <Modal
        animationType='none'
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {this._setModalVisible(false)}}>
        <View style={CommonStyles.modalContainer}>
          <View style={[{backgroundColor: '#fff', padding: 10},
                        CommonStyles.innerContainer]}>
            <View style={{marginTop: 10,
                          marginBottom: 10}}>
              {this.modalFacebookLoginButton()}
            </View>
            {this.modalEmailLoginButton()}
            {this.modalSignUpButton()}
            {this.modalCancelLoginButton()}
          </View>
        </View>
      </Modal>
    )
  }
  logOutButton() {
    if (this.props.auth.result.provider === "facebook.com") {
      return (
        <View style={{marginTop: 10}}>{this.modalFacebookLoginButton()}</View>)
    } else {
      const buttonText = this.props.auth.anonymous ? 'Anon Log Out' : 'Email Log Out'
      return (
        <TouchableHighlight
          style={CommonStyles.iconTextButton}
          onPress={this._emailLogout.bind(this)}>
          {this.iconTextButton("ios-exit-outline", buttonText)}
        </TouchableHighlight>)
    }
  }
  profileImageButton() {
    const uri = this.props.auth.result.picture
    const buttonColor = this.props.auth.result ? '#006400' : 'white'
    return (
        <Image
          source={{uri: uri}}
          style={[CommonStyles.profileImage, {borderColor: buttonColor}]}/>
    )
  }
  flexOneSpacerView() {
    return(<View style={{flex: 1}}/>)
  }
  iconTextButton(iconName, buttonText) {
    return(
      <View style={CommonStyles.iconTextButtonRow}>
        {this.flexOneSpacerView()}
        <Icon
          name={iconName}
          size={26}
          style={CommonStyles.iconTextButtonIcon}/>
        <Text style={CommonStyles.iconTextButtonText}>
          {buttonText}
        </Text>
      </View>
    )
  }
  helpEmailButton() {
    return (
      <TouchableHighlight
        onPress={this.sendEmail.bind(this)}
        style={CommonStyles.iconTextButton}>
        {this.iconTextButton("ios-mail-outline", "Help Email")}
      </TouchableHighlight>
    )
  }
  userSettingsButton() {
    return (
      <TouchableHighlight
        onPress={this.userSettings.bind(this)}
        style={CommonStyles.iconTextButton}>
        {this.iconTextButton("ios-settings-outline", "User Settings")}
      </TouchableHighlight>
    )
  }
  // createGroupButton() {
  //   return (
  //     <TouchableHighlight
  //       onPress={this.createGroup.bind(this)}
  //       style={CommonStyles.iconTextButton}>
  //       {this.iconTextButton("ios-school-outline", "Create Group")}
  //     </TouchableHighlight>
  //   )
  // }
  clientAppInviteButton() {
    return (
      <TouchableHighlight
        onPress={this.clientAppInvite.bind(this)}
        style={CommonStyles.iconTextButton}>
        {this.iconTextButton("ios-clipboard-outline", "Invite Client")}
      </TouchableHighlight>
    )
  }
  friendAppInviteButton() {
    return (
      <TouchableHighlight
        onPress={this.friendAppInvite.bind(this)}
        style={CommonStyles.iconTextButton}>
        {this.iconTextButton("ios-contacts-outline", "Refer Friend")}
      </TouchableHighlight>
    )
  }
}
