import React, { Component } from "react"
import {
  Image,
  View,
  Text,
  Platform,
  BackAndroid,
  TouchableOpacity,
  NavigationExperimental
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
} = NavigationExperimental

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

import Start from '../containers/StartContainer'
import Settings from './UserSettings'

export default class Extras extends Component {
  constructor(props) {
    super(props)
    this._handleBackAction = this._handleBackAction.bind(this)
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  _renderScene (props) {
    const prefix = 'scene_'
    const { scene } = props
    if (scene.key === prefix + 'start') {
      return (
        <Start
          _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'settings') {
      return (
        <Settings
          clientAppInvite={() => this.props.sendClientAppInvite()}
          auth={this.props.auth}
          settings={this.props.auth.settings}
          goBack={this._handleBackAction.bind(this)}
          _storeForm={(form) => this.props.storeSettingsForm(form)}
          _storeSettings={(settings) => this.props.storeUserSettings(settings)}
        />
      )
    }
  }
  _renderHeader(props) {
    if (this.props.extras.index !== 0) {
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
    if (this.props.extras.index === 0) {
      return false
    }
    this.props.popExt()
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushExt(action.route)
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
        navigationState={this.props.extras}
        onNavigate={this._handleNavigate.bind(this)}
        onNavigateBack={this._handleBackAction.bind(this)}
        renderScene={this._renderScene.bind(this)}
        renderHeader={this._renderHeader.bind(this)}
      />
    )
  }
}
