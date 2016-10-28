import React, { Component } from 'react'
import {
  View,
  Platform,
} from 'react-native'

import ScrollableTabView from 'react-native-scrollable-tab-view'

import Icon from 'react-native-vector-icons/Ionicons'
import Gallery from '../containers/GalleryContainer'
import Clients from '../containers/ExpertContainer'
import Extras from '../containers/ExtrasContainer'

export default class HomeTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clientNotification: '',
      trainerNotification: ''
    }
  }
  _renderTabContent (key) {
    switch (key) {
      case 'Home':
        return (
          <Gallery
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
    const notificationCount = this.props.notification.client + this.props.notification.trainer
    const notification = notificationCount > 0 ? notificationCount : 0
    if (Platform.OS === 'ios') {
      var {PushNotificationIOS} = require('react-native')
      PushNotificationIOS.setApplicationIconBadgeNumber(notification)
    }
    const trainer = this.props.trainer.clients.length > 0
    const trainerNotificationCount = this.props.notification.trainer > 0 ? this.props.notification.trainer : undefined
    const clientNotificationCount = this.props.notification.client > 0 ? this.props.notification.client : undefined
    const tabs = this.props.tabs.routes.map((tab, i) => {
      if (tab.title !== 'Clients') {
        badgeValue = tab.title === 'Home' ? clientNotificationCount : undefined
      }
      else {
        badgeValue = trainerNotificationCount
      }
      if ( (tab.title !== 'Clients') ||
           (tab.title === 'Clients' && trainer)) {
        if (Platform.OS === 'ios') {
          return (
            <Icon.TabBarItemIOS
              key={tab.name}
              title={tab.title}
              iconName={tab.name}
              selectedIconName={tab.iconName}
              iconSize={40}
              badge={badgeValue}
              onPress={() => {
                this.props.changeTab(i)
              }}
              selected={this.props.tabs.index === i}>
              {this._renderTabContent(tab.key)}
            </Icon.TabBarItemIOS>
          )
        }
        else {
          // Android
          return(
            <View
              tabLabel={tab.title}
              style={{flex: 1}}>
              {this._renderTabContent(tab.key)}
            </View>)
        }
      }
    })
    if (Platform.OS === 'ios') {
      var {TabBarIOS} = require('react-native')
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
    } else {
      // TODO: Something better for Android
      // var ScrollableTabView = require('react-native-scrollable-tab-view')
      return (
        <ScrollableTabView
          ref="scrollableTabView"
          tabBarPosition="bottom">
          {tabs}
        </ScrollableTabView>
      )
    }
  }
}
