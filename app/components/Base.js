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
  BackButton: NavigationHeaderBackButton
} = NavigationExperimental

import Home  from '../containers/HomeContainer'
import Media from './Media'
import Gallery from '../containers/GalleryContainer'

export default class Base extends Component {
  constructor(props) {
    super(props);
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
    this._handleNavigate = this._handleNavigate.bind(this)
  }
  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  _renderScene (props) {
    const prefix = 'scene_'
    const { scene } = props
    if (scene.key === prefix + 'home') {
      return <Home
        _handleNavigate={this._handleNavigate.bind(this)}/>
    }
    else if (scene.key === prefix + 'media') {
      return <Media
        baseHandleBackAction={this._handleBackAction.bind(this)}/>
    }
    else if (scene.key === prefix + 'gallery') {
      return <Gallery
        result={this.props.auth.result}
        baseHandleBackAction={this._handleBackAction.bind(this)}/>
    }
  }
  _handleBackAction () {
    if (this.props.navigation.index === 0) {
      return false
    }
    this.props.pop()
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
        navigationState={this.props.navigation}
        onNavigate={this._handleNavigate.bind(this)}
        renderScene={this._renderScene.bind(this)}
      />
    )
  }
}
