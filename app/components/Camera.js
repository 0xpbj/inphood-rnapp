import React, { Component } from "react";
import {
  View,
  Image,
  Platform,
  BackAndroid,
  TouchableOpacity,
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
import Icon from 'react-native-vector-icons/Ionicons'

export default class Camera extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.camera.photo
    }
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
    if (nextProps.camera.inProgress !== null) {
      if (nextProps.camera.inProgress === true)
        this.setState({})
      else if (nextProps.camera.inProgress === false)
        this._handleCaptionAction()
    }
  }
  _renderScene (props) {
    const prefix = 'scene_'
    const { scene } = props
    if (scene.key === prefix + 'picture') {
      return (
        <Picture
          _handleNavigate={this._handleNavigate.bind(this)}
          _store64Camera={(action) => this.props.store64Camera(action)}
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
          _tags={this.props.camera.tags}
          _selectedPhoto={this.state.photo}
          _storeCaption={(action) => this.props.storeCameraCaption(action)}
          _handleBackAction={this._handleBackAction.bind(this)}
          _inProgress={this.props.camera.inProgress}
          _library={false}/>
      )
    }
  }
  _renderHeader(props) {
    if (this.props.camera.index !== 0) {
      return (
        <NavigationHeader
          {...props}
          renderTitleComponent={this._renderTitleComponent}
          renderLeftComponent={this._renderLeftComponent.bind(this)}
        />
      )
    }
  }
  _renderLeftComponent(props) {
    return (
      <NavigationHeader.BackButton
        onPress={this._handleBackAction.bind(this)}
      />
    )
  }
  _renderTitleComponent(props) {
    return (
      <NavigationHeader.Title>
        {props.scene.route.title}
      </NavigationHeader.Title>
    )
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
    this.props.changeTab(1)
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
        onNavigateBack={this._handleBackAction}
        renderScene={this._renderScene.bind(this)}
        renderHeader={this._renderHeader.bind(this)}
      />
    )
  }
}
