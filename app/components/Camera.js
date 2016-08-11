import React, { Component } from "react";
import {
  View,
  Image,
  Platform,
  BackAndroid,
  TouchableOpacity,
  StyleSheet,
  NavigationExperimental
} from 'react-native'

const route = {
  type: 'push',
  route: {
    key: 'caption',
    title: 'Meal ingredients'
  }
}

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Picture from './Picture'
import Selected from './Selected'
import Caption from '../containers/CaptionContainer'
import {homeIcon, userIcon} from './Icons'

export default class Camera extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.camera.photo
    }
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
    this._handleNavigate = this._handleNavigate.bind(this)
    this._handleCaptionAction = this._handleCaptionAction.bind(this)
  }
  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      photo: nextProps.camera.photo
    })
  }
  _renderScene (props) {
    const prefix = 'scene_'
    const { scene } = props
    this.props.mediaVisible(true)
    if (scene.key === prefix + 'picture') {
      return (
        <Picture
          _handleNavigate={this._handleNavigate.bind(this)}
          _takePhoto={(action) => this.props.takePhoto(action)}/>
      )
    }
    else if (scene.key === prefix + 'selected') {
      return (
        <Selected
          _buttonName="Next"
          _nextRoute={route}
          _selectedPhoto={this.state.photo}
          _storeTitle={(action) => this.props.storeCameraTitle(action)}
          _handleNavigate={this._handleNavigate.bind(this)}/>
      )
    }
    else if (scene.key === prefix + 'caption') {
      return (
        <Caption
          _transmit={this._handleCaptionAction.bind(this)}
          _selectedPhoto={this.state.photo}
          _storeCaption={(action) => this.props.storeCameraCaption(action)}
          _handleBackAction={this._handleBackAction.bind(this)}
          _library={false}/>
      )
    }
  }
  _renderOverlay(props) {
    return (
      <NavigationHeader
        {...props}
        onNavigateBack={this._handleBackAction}
        renderTitleComponent={this._renderTitleComponent}
        renderLeftComponent={this._renderLeftComponent.bind(this)}
        renderRightComponent={this._renderRightComponent.bind(this)}
      />
    )
  }
  _renderLeftComponent(props) {
    if (this.props.camera.index === 0) {
      return (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={()=>this._goToLogin()}>
          <Image
            style={styles.button}
            source={{uri: userIcon.uri, scale: userIcon.scale}}
          />
        </TouchableOpacity>
      )
    }
    return (
      <NavigationHeader.BackButton
        onPress={props.onNavigateBack}
      />
    )
  }
  _renderRightComponent(props) {
    if (this.props.camera.index === 0) {
      return (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={()=>this._goToHome()}>
          <Image
            style={styles.button}
            source={{uri: homeIcon.uri, scale: homeIcon.scale}}
          />
        </TouchableOpacity>
      )
    }
  }
  _renderTitleComponent(props) {
    return (
      <NavigationHeader.Title>
        {props.scene.route.title}
      </NavigationHeader.Title>
    )
  }
  _goToLogin() {
    this.props.mediaVisible(false)
    this.props.chatVisible(false)
    this.props.changeTab(0)
  }
  _goToHome() {
    this.props.mediaVisible(false)
    this.props.chatVisible(false)
    this.props.changeTab(2)
  }
  _handleBackAction () {
    if (this.props.camera.index === 0) {
      return false
    }
    this.props.popCam()
    return true
  }
  _handleCaptionAction () {
    this.props.takePhoto('')
    this._handleBackAction()
    this._handleBackAction()
    this.props.mediaVisible(false)
    this.props.chatVisible(false)
    this.props.changeTab(2)
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushCam(action.route)
        return true
      case 'back':
      case 'pop':
        return this._handleBackAction()
      default:
        return false
    }
  }
  render () {
    return (
      <NavigationCardStack
        navigationState={this.props.camera}
        onNavigate={this._handleNavigate.bind(this)}
        renderScene={this._renderScene.bind(this)}
        renderOverlay={this._renderOverlay.bind(this)}
      />
    )
  }
}

const styles = StyleSheet.create({
  base64: {
    flex: 1,
    height: 32,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 28,
    width: 28,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain'
  }
})
