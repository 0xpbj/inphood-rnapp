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
import Media from './Media'
import Home from '../containers/GalleryContainer'
import Clients from '../containers/ExpertContainer'
import Extras from '../containers/ExtrasContainer'

export default class HomeTabs extends Component {
  constructor(props) {
    super(props)
    PushNotificationIOS.requestPermissions()
  }
  _renderTabContent (key) {
    switch (key) {
      case 'Camera':
        return (
          <Media
            changeTab={(i)=>this.props.changeTab(i)}
          />
        )
      case 'Home':
        return (
          <Home
            result={this.props.auth.result}
          />
        )
      case 'Clients':
        return (
          <Clients
            result={this.props.auth.result}
          />
        )
      case 'Extras':
        return (
          <Extras />
        )
      default:
        return <View />
    }
  }
  render () {
    console.disableYellowBox = true
    if (this.props.auth.result === null) {
      return <Extras />
    }
    let clientNotificationCount = undefined
    let trainerNotificationCount = undefined
    for (let id in this.props.notification.clientNotifications) {
      console.log('Client notification: ', this.props.notification.clientNotifications[id])
      PushNotificationIOS.scheduleLocalNotification(this.props.notification.clientNotifications[id])
      if (clientNotificationCount === undefined)
        clientNotificationCount = 0
      clientNotificationCount = clientNotificationCount + this.props.notification.clientNotifications[id].applicationIconBadgeNumber
    }
    for (let id in this.props.notification.trainerNotifications) {
      console.log('Trainer notification: ', this.props.notification.trainerNotifications[id])
      PushNotificationIOS.scheduleLocalNotification(this.props.notification.trainerNotifications[id])
      if (trainerNotificationCount === undefined)
        trainerNotificationCount = 0
      trainerNotificationCount = trainerNotificationCount + this.props.notification.trainerNotifications[id].applicationIconBadgeNumber
    }
    const trainer = this.props.auth.trainer
    const notificationCount = this.props.notification.client + this.props.notification.trainer
    const notification = notificationCount > 0 ? notificationCount : 0
    PushNotificationIOS.setApplicationIconBadgeNumber(notification)
    trainerNotificationCount = this.props.notification.trainer > 0 ? trainerNotificationCount : undefined
    clientNotificationCount = this.props.notification.client > 0 ? clientNotificationCount : undefined
    const tabs = this.props.tabs.routes.map((tab, i) => {
      if (tab.title !== 'Clients') {
        return (
          <Icon.TabBarItemIOS
            key={tab.name}
            title={tab.title}
            iconName={tab.name}
            selectedIconName={tab.iconName}
            iconSize={40}
            badge={tab.title === 'Home' ? clientNotificationCount : undefined}
            onPress={() => {
              this.props.changeTab(i)
            }}
            selected={this.props.tabs.index === i}>
            {this._renderTabContent(tab.key)}
          </Icon.TabBarItemIOS>
        )
      }
      else if (trainer && tab.title === 'Clients') {
        return (
          <Icon.TabBarItemIOS
            key={tab.name}
            title={tab.title}
            iconName={tab.name}
            selectedIconName={tab.iconName}
            iconSize={40}
            badge={trainerNotificationCount}
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
