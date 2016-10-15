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
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

const route = {
  type: 'push',
  route: {
    key: 'caption',
    title: 'Meal ingredients'
  }
}

import Selected from './Selected'
import Photos  from '../containers/PhotosContainer'
import Caption from '../containers/CaptionContainer'
import Icon from 'react-native-vector-icons/Ionicons'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

export default class Library extends Component {
  constructor(props) {
    super(props)
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.library.inProgress !== null) {
      if (nextProps.library.inProgress === true)
        this.setState({})
      else if (nextProps.library.inProgress === false)
        this._handleCaptionAction()
    }
  }
  _renderScene (props) {
    const prefix = 'scene_'
    const { scene } = props
    if (scene.key === prefix + 'photos') {
      return (
        <Photos
          _selectPhoto={(action) => this.props.selectPhoto(action)}
          _store64Library={(action) => this.props.store64Library(action)}
          _handleNavigate={this._handleNavigate.bind(this)}/>
      )
    }
    else if (scene.key === prefix + 'selected') {
      return (
        <Selected
          _buttonName="Next"
          _nextRoute={route}
          _selectedPhoto={this.props.library.selected}
          _storeTitle={(action) => this.props.storeLibraryTitle(action)}
          _handleNavigate={this._handleNavigate.bind(this)}/>
      )
    }
    else if (scene.key === prefix + 'caption') {
      return (
        <Caption
          _tags={this.props.library.tags}
          _selectedPhoto={this.props.library.selected}
          _storeCaption={(action) => this.props.storeLibraryCaption(action)}
          _handleBackAction={this._handleBackAction.bind(this)}
          _inProgress={this.props.library.inProgress}
          _library={true}/>
      )
    }
  }
  _renderHeader(props) {
    if (this.props.library.index !== 0) {
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
    this.props.changeTab(1)
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
        onNavigateBack={this._handleBackAction.bind(this)}
        renderScene={this._renderScene.bind(this)}
        renderHeader={this._renderHeader.bind(this)}
      />
    )
  }
}
