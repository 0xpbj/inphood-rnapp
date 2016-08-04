import React, { Component } from "react";
import {
  BackAndroid,
  NavigationExperimental
} from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Picture from './Picture'
import Selected from './Selected'
import Caption from '../containers/CaptionContainer'

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
  shouldComponentUpdate(nextProps, nextState) {
    let flag1 = nextProps.camera.photo !== this.props.camera.photo
    let flag2 = nextProps.navigation.routes.length !== this.props.navigation.routes.length
    return flag1 || flag2
  }
  _renderScene (props) {
    const prefix = 'scene_'
    const { scene } = props
    if (scene.key === prefix + 'picture') {
      return <Picture
        _handleNavigate={this._handleNavigate.bind(this)}
        _takePhoto={(action) => this.props.takePhoto(action)}/>
    }
    if (scene.key === prefix + 'selected') {
      return <Selected
        _selectedPhoto={this.state.photo}
        _handleNavigate={this._handleNavigate.bind(this)}/>
    }
    if (scene.key === prefix + 'caption') {
      return <Caption
        _transmit={this._handleCaptionAction.bind(this)}
        _selectedPhoto={this.state.photo}
        _storeCaption={(action) => this.props.storeCameraCaption(action)}
        _handleBackAction={this._handleBackAction.bind(this)}
        _library={false}/>
    }
  }
  _renderOverlay(props) {
    return (
      <NavigationHeader
        {...props}
        onNavigateBack={this._handleBackAction}
        renderTitleComponent={this._renderTitleComponent}
      />
    );
  }
  _renderTitleComponent(props) {
    return (
      <NavigationHeader.Title>
        {props.scene.route.title}
      </NavigationHeader.Title>
    );
  }
  _handleBackAction () {
    if (this.props.navigation.index === 0) {
      return false
    }
    this.props.pop()
    return true
  }
  _handleCaptionAction () {
    if (this.props.camera.caption === '') {
      alert ('Please enter a caption')
      return false
    }
    this.props.takePhoto('')
    this._handleBackAction()
    this._handleBackAction()
    this.props.changeTab(2)
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.push(action.route)
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
        style={{flex: 1}}
        navigationState={this.props.navigation}
        onNavigate={this._handleNavigate.bind(this)}
        renderScene={this._renderScene.bind(this)}
        renderOverlay={this._renderOverlay.bind(this)}
      />
    )
  }
}
