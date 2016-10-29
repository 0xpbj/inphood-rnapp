import React, { Component } from 'react'
import {
  View,
  Text,
  BackAndroid,
  TouchableOpacity,
} from 'react-native'

import PushNotification from 'react-native-push-notification'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Icon from 'react-native-vector-icons/Ionicons'

import CommonStyles from './styles/common-styles'
import Gallery from '../containers/GalleryContainer'
import Clients from '../containers/ExpertContainer'
import Extras from '../containers/ExtrasContainer'

const HomeTabBar = React.createClass({
  tabIcons: ['ios-home-outline', 'ios-people-outline', 'ios-options-outline'],
  tabTitle: ['Home', 'Clients', 'Extras'],
  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },
  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },
  render() {
    return <View style={CommonStyles.tabs}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={CommonStyles.tab}>
          <Icon
            name={tab}
            size={40}
            color={this.props.activeTab === i ? '#006400' : 'rgb(204,204,204)'}
            ref={(icon) => { this.tabIcons[i] = icon }}
          />
        </TouchableOpacity>
      })}
    </View>
  },
})

export default class HomeTabs extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction.bind(this))
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction.bind(this))
  }
  _handleBackAction () {
    // TODO: PBJAC fix in 1.2
    return true
  }
  _renderTabContent (key) {
    switch (key) {
      case 'ios-home':
        return (
          <Gallery
            result={this.props.auth.result}
          />
        )
      case 'ios-people':
        return (
          <Clients
            result={this.props.auth.result}
          />
        )
      case 'ios-options':
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
    // TODO:
    // PBJ reads:  does not work for all android devices (https://github.com/leolin310148/ShortcutBadger)
    // PushNotification.setApplicationIconBadgeNumber(notification)
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
        return(
          <View
            tabLabel={tab.key}
            style={{flex: 1}}>
            {this._renderTabContent(tab.key)}
          </View>)
      }
    })
    return (
      <ScrollableTabView
        ref="scrollableTabView"
        tabBarPosition="bottom"
        prerenderingSiblingsNumber={3}
        renderTabBar={() => <HomeTabBar />}
      >
        {tabs}
      </ScrollableTabView>
    )
  }
}
