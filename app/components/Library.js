import React, { Component } from "react";
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

const route = {
  type: 'push',
  route: {
    key: 'caption',
    title: 'Describe your meal'
  }
}

import Photos  from '../containers/PhotosContainer'
import Selected from './Selected'
import Caption from '../containers/CaptionContainer'
import Icon from 'react-native-vector-icons/Ionicons'
import {homeIcon} from './Icons'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
export default class Library extends Component {
  constructor(props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
    this._handleNavigate = this._handleNavigate.bind(this)
    this._handleCaptionAction = this._handleCaptionAction.bind(this)
  }
  componentWillMount() {
    this.props.loadPhotosInit()
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
    if (scene.key === prefix + 'photos') {
      return (
        <Photos
          callback={(action) => this.props.selectPhoto(action)}
          _handleNavigate={this._handleNavigate.bind(this)}/>
      )
    }
    else if (scene.key === prefix + 'selected') {
      return (
        <Selected
          _buttonName="Next"
          _nextRoute={route}
          _selectedPhoto={this.props.library.selected}
          _handleNavigate={this._handleNavigate.bind(this)}/>
      )
    }
    else if (scene.key === prefix + 'caption') {
      return (
        <Caption
          _transmit={this._handleCaptionAction.bind(this)}
          _selectedPhoto={this.props.library.selected}
          _storeCaption={(action) => this.props.storeLibraryCaption(action)}
          _handleBackAction={this._handleBackAction.bind(this)}
          _library={true}/>
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
      />
    )
  }
  _renderLeftComponent(props) {
    if (this.props.library.index === 0) {
      return (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.props.baseHandleBackAction}>
          {/* onPress={()=>this.props.changeTab(2)}> */}
          <Image
            style={styles.button}
            source={{uri: homeIcon.uri, scale: homeIcon.scale}}
          />
        </TouchableOpacity>
      )
    }
    return (
      <NavigationHeader.BackButton
        onPress={props.onNavigateBack}
      />
    );
  }
  _renderTitleComponent(props) {
    return (
      <NavigationHeader.Title>
        {props.scene.route.title}
      </NavigationHeader.Title>
    )
  }
  _handleBackAction () {
    if (this.props.library.index === 0) {
      return false
    }
    this.props.popLib()
    return true
  }
  _handleCaptionAction () {
    this.props.selectPhoto('')
    this._handleBackAction()
    this._handleBackAction()
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushLib(action.route)
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
        navigationState={this.props.library}
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
