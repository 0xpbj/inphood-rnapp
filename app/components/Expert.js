import React, { Component } from "react"
import {
  Image,
  View,
  Text,
  Platform,
  StyleSheet,
  BackAndroid,
  TouchableOpacity,
  NavigationExperimental
} from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Client from '../containers/ClientContainer'
import ClientGallery from '../containers/ClientGalleryContainer'
import ChatView from '../containers/TrainerChatContainer'

export default class Expert extends Component {
  constructor(props) {
    super(props);
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
    this._handleNavigate = this._handleNavigate.bind(this)
    this.state = {
      hack: false,
    }
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
    if (scene.key === prefix + 'expert') {
      return (
        <Client
          _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'client') {
      return (
        <ClientGallery
          _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'tchat') {
      return (
        <ChatView
          result={this.props.result}
         _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
  }
  _renderOverlay(props) {
    if (this.props.trainerNav.index !== 0) {
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
        onPress={this._handleBackAction}
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
    this.props.trainerChatVisible(false)
    this.setState({hack: true})
    if (this.props.trainerNav.index === 0) {
      return false
    }
    this.props.popExp()
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushExp(action.route)
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
        navigationState={this.props.trainerNav}
        onNavigate={this._handleNavigate.bind(this)}
        onNavigateBack={this._handleBackAction}
        renderScene={this._renderScene.bind(this)}
        renderHeader={this._renderOverlay.bind(this)}
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
  },
  topbar: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF'
  }
})
