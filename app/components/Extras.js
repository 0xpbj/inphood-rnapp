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

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

import Start from './Start'
import Login from './EmailLogin'
import Signup from './UserSignUp'
import Settings from './UserSettings'
import Profile from './UserProfile'

export default class Extras extends Component {
  constructor(props) {
    super(props)
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
    if (scene.key === prefix + 'start') {
      return (
        <Start 
         loginRequest={()=>this.props.loginRequest()}
         logoutRequest={()=>this.props.logoutRequest()}
         storeToken={(action)=>this.props.storeToken(action)}
         storeResult={(action)=>this.props.storeResult(action)}
         auth={this.props.auth}
         _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'login') {
      return (
        <Login 
          _handleNavigate={this._handleNavigate.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'signup') {
      return (
        <Signup 
          _handleNavigate={this._handleBackAction.bind(this)}
        />
      )
    }
    else if (scene.key === prefix + 'settings') {
      return (
        <Settings />
      )
    }
    else if (scene.key === prefix + 'profile') {
      return (
        <Profile />
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

const styles = StyleSheet.create({
  containerImage: {
    flex: 1,
    resizeMode: 'contain',
    //  The null assignments below causes the renderer to re-determine size (which was broken
    // when the push direct to the camera view was implemented).
    height: null,
    width: null,
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 10,
  },
  buttonRowStyle: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center'
  },
  buttonColumnStyle: {
    flex: 1,
    alignItems: 'center'
  },
  marginStyle: {
    margin: 5,
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  horizontalScrollView: {
    height: 120,
  },
  containerPage: {
    height: 50,
    width: 50,
    backgroundColor: '#527FE4',
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: '#888888',
    left: 80,
    top: 20,
    height: 40,
  },
  button: {
    margin: 7,
    // padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  buttonContents: {
    flexDirection: 'row',
    width: 64,
    height: 64,
  },
  scrollViewContentStyle: {
  },
  // dontFuckWithStyle: {
  //   // TODO: Use PixelRatio.get() to divide the actual resolutions
  //   // down to the values below (PixelRatio is 3 on a iPhone 6s plus so
  //   // I manually got those number from (1242 by 1104) / 3. )
  //   height: 368,
  //   width: 414,
  // },
  flipBoardImageStyle: {
  },
  img: {
    width: 64,
    height: 64,
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },
  emailButton: {
    marginTop: 10,
    height: 30,
    backgroundColor: 'red',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})
