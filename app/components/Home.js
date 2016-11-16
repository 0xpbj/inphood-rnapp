import React, { Component } from 'react'
import {
  View,
  Text,
  BackAndroid,
  TouchableOpacity,
} from 'react-native'

import DeviceInfo from 'react-native-device-info'

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
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      })
    })
  },
  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress
    const green = 89 + (204 - 89) * progress
    const blue = 152 + (204 - 152) * progress
    return `rgb(${red}, ${green}, ${blue})`
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
      case 'Home':
        return (
          <Gallery
            auth={this.props.auth}
          />
        )
      case 'Clients':
        return (
          <Clients
            auth={this.props.auth}
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
  handleChangeTab({i, ref, from}) {
    this.props.changeTab(i)
  }
  isBadgeNumberingSupported() {
    // Support:  Does not work for all android devices (https://github.com/leolin310148/ShortcutBadger)
    //
    // From: https://github.com/leolin310148/ShortcutBadger/issues/128
    // Motorola and Google Nexus do not seem to support badging, therefore
    // exclude them with this method.
    //
    //    On a Nexus 5X, the following values are returned ...
    //      DeviceInfo.getBrand():      google
    //      DeviceInfo.getModel():      Nexus 5X
    //      DeviceInfo.getUserAgent():  Dalvik/2.1.0 (Linux U Android 7.0 Nexus 5X Build/NBD90W)
    //
    const brandStrLC = DeviceInfo.getBrand().toLowerCase()

    if ((brandStrLC === 'google') || (brandStrLC === 'motorola')) {
      console.log('Badge numbering not supported for brand: ' + brandStrLC)
      return false
    }

    return true
  }
  render () {
    const notificationCount = this.props.notification.client + this.props.notification.trainer + this.props.notification.groups
    const notification = notificationCount > 0 ? notificationCount : 0
    if (this.isBadgeNumberingSupported()) {
      PushNotification.setApplicationIconBadgeNumber(notification)
    }
    const trainer = this.props.trainer.clients.length > 0
    const trainerNotificationCount = this.props.notification.trainer > 0 ? this.props.notification.trainer : undefined
    const clientNotificationCount = this.props.notification.client > 0 ? this.props.notification.client : undefined
    const tabs = this.props.tabs.routes.map((tab, i) => {
      let badgeValue = undefined
      if (tab.title === 'Home')
        badgeValue = clientNotificationCount
      else if (tab.title === 'Clients')
        badgeValue = trainerNotificationCount
      if ( (tab.title === 'Home' || tab.title === 'Extras') ||
           (tab.title === 'Clients' && trainer) ) {
        return(
          <View
            tabLabel={tab.key}
            style={{flex: 1}}>
            {this._renderTabContent(tab.title)}
          </View>
        )
      }
    })
    return (
      <ScrollableTabView
        ref="scrollableTabView"
        tabBarPosition="bottom"
        prerenderingSiblingsNumber={3}
        page={this.props.tabs.index}
        onChangeTab={this.handleChangeTab.bind(this)}
        renderTabBar={() => <HomeTabBar />}
      >
        {tabs}
      </ScrollableTabView>
    )
  }
}
