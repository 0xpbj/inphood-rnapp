import React, { Component } from 'react'
import { 
  View, 
  TabBarIOS, 
  BackAndroid, 
  PushNotificationIOS, 
  NavigationExperimental 
} from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Icon from 'react-native-vector-icons/Ionicons'
import Login from './Login'
import Media from './Media'
import Gallery from '../containers/GalleryContainer'
import Expert from '../containers/ExpertContainer'

export default class HomeTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cvisible: false,
      mvisible: false,
      evisible: false,
    }
    PushNotificationIOS.requestPermissions()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      cvisible: nextProps.tabs.cvisible,
      mvisible: nextProps.tabs.mvisible,
      evisible: nextProps.tabs.evisible,
    })
  }
  _renderTabContent (key) {
    switch (key) {
      case 'Login':
        return <Login
                 loginRequest={()=>this.props.loginRequest()}
                 logoutRequest={()=>this.props.logoutRequest()}
                 storeToken={(action)=>this.props.storeToken(action)}
                 storeResult={(action)=>this.props.storeResult(action)}
                 auth={this.props.auth}
                />
      case 'Camera':
        return (
          <Media
            changeTab={(i)=>this.props.changeTab(i)}
          />
        )
      case 'Home':
        return (
          <Gallery
            result={this.props.auth.result}
          />
        )
      case 'Expert':
        return (
          <Expert 
            result={this.props.auth.result}
          />
        )
      default:
        return <View />
    }
  }
  render () {
    const {cvisible, mvisible, evisible} = this.state
    if (cvisible) {
      return (
        <Gallery
          result={this.props.auth.result}
        />
      )
    }
    else if (mvisible) {
      return (
        <Media
          changeTab={(i)=>this.props.changeTab(i)}
        />
      )
    }
    else if (evisible) {
      return (
        <Expert
          result={this.props.auth.result}
        />
      )
    }
    if (this.props.auth.result === null) {
      return <Login
               loginRequest={()=>this.props.loginRequest()}
               logoutRequest={()=>this.props.logoutRequest()}
               storeToken={(action)=>this.props.storeToken(action)}
               storeResult={(action)=>this.props.storeResult(action)}
               auth={this.props.auth}
              />
    }
    const trainer = this.props.auth.trainer
    const notificationCount = this.props.notification.client + this.props.notification.trainer
    const notification = notificationCount > 0 ? notificationCount : 0
    PushNotificationIOS.setApplicationIconBadgeNumber(notification)
    const tabs = this.props.tabs.routes.map((tab, i) => {
      if (i !== 3) {
        return (
          <Icon.TabBarItemIOS
            title={tab.title}
            iconName={tab.name}
            selectedIconName={tab.iconName}
            iconSize={40}
            badge={i === 2 ? (this.props.notification.client > 0 ? this.props.notification.client : undefined) : undefined}
            onPress={() => {
              this.props.changeTab(i)
            }}
            selected={this.props.tabs.index === i}>
            {this._renderTabContent(tab.key)}
          </Icon.TabBarItemIOS>
        )
      }
      else if (trainer && i === 3) {
        return (
          <Icon.TabBarItemIOS
            title={tab.title}
            iconName={tab.name}
            selectedIconName={tab.iconName}
            iconSize={40}
            badge={this.props.notification.trainer > 0 ? this.props.notification.trainer : undefined}
            onPress={() => {
              this.props.changeTab(i)
            }}
            selected={this.props.tabs.index === i}>
            {this._renderTabContent(tab.key)}
          </Icon.TabBarItemIOS>
        )
      }
    })
    return (
      <TabBarIOS
        unselectedTintColor="black"
        tintColor="#006400"
        barTintColor="white"
        translucent={true}
      >
        {tabs}
      </TabBarIOS>
    )
  }
}
