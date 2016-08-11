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
    key: 'chat',
    title: 'Feedback'
  }
}

import GalleryView  from '../containers/GalleryViewContainer'
// import GalleryView from './GalleryListView'
import ChatView from '../containers/ChatContainer'
import Selected from './Selected'
import {homeIcon} from './Icons'
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu'

export default class Gallery extends Component {
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
    if (scene.key === prefix + 'gallery') {
      return (
        <GalleryView
           result={this.props.result}
          _handleNavigate={this._handleNavigate.bind(this)}
          _setFeedback={(action) => this.props.feedbackPhoto(action)}
        />
      )
    }
    else if (scene.key === prefix + 'selected') {
      return (
        <Selected
          _buttonName="Feedback"
          _nextRoute={route}
          _selectedPhoto={this.props.gallery.selected}
          _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'chat') {
      return (
        <ChatView
          result={this.props.result}
          feedback={this.props.gallery.selected}
         _handleNavigate={this._handleNavigate.bind(this)}
        />
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
        // renderRightComponent={this._renderRightComponent.bind(this)}
      />
    )
  }
  _renderLeftComponent(props) {
    if (this.props.gallery.index === 0) {
      return (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.props.baseHandleBackAction}>
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
    )
  }
  _renderRightComponent(props) {
    if (this.props.gallery.index === 0) {
      return (
        <MenuContext style={{ flex: 1, zIndex: 1 }}>
          <View style={styles.topbar}>
            <Menu onSelect={(value) => this.props.filterPhotos(value)}>
              <MenuTrigger>
                <Text style={{ fontSize: 20 }}>&#8942;</Text>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption value={'Breakfast'}>
                  <Text>Breakfast</Text>
                </MenuOption>
                <MenuOption value={'Lunch'}>
                  <Text>Lunch</Text>
                </MenuOption>
                <MenuOption value={'Dinner'}>
                  <Text>Dinner</Text>
                </MenuOption>
                <MenuOption value={'Snack'}>
                  <Text>Snack</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </MenuContext>
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
  _handleBackAction () {
    if (this.props.gallery.index === 0) {
      return false
    }
    this.props.popGal()
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushGal(action.route)
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
        navigationState={this.props.gallery}
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
  },
  topbar: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF'
  }
})
