import React, { Component } from 'react'
import {Platform} from 'react-native'

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import PushNotification from 'react-native-push-notification'
import DeviceInfo from 'react-native-device-info'
import Media from '../containers/MediaContainer'
import Home from '../containers/HomeContainer'
import Extras from '../containers/ExtrasContainer'

export default class App extends Component {
  constructor(props) {
    super(props)
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
  handleChangeTab({i, ref, from}) {
    this.props.changePage(i)
  }
  render () {
    console.disableYellowBox = true
    const notificationCount = this.props.notification.client + this.props.notification.trainer
    const notification = notificationCount > 0 ? notificationCount : 0
    if (this.isBadgeNumberingSupported()) {
      PushNotification.setApplicationIconBadgeNumber(notification)
    }
    let locked = false
    if (this.props.tabs.index > 0 || this.props.gallery.index > 0 || this.props.media.index > 0) {
      locked = true
    }
    if (this.props.auth.uid === '') {
      return <Extras />
    }
    // TODO:  PBJOC, get rid of platform everywhere and bug with
    //        prerender failing for home screen.
    const prerenderSetting = Platform.OS === "ios" ? 1 : 0
    return (
      <ScrollableTabView
        tabBarPosition="bottom"
        page={this.props.page.index}
        locked={locked}
        onChangeTab={this.handleChangeTab.bind(this)}
        prerenderingSiblingsNumber={prerenderSetting}
        renderTabBar={() =>
          <ScrollableTabBar
            backgroundColor='black'
            style={{height: 0}}
          />
        }
      >
        <Media />
        <Home />
      </ScrollableTabView>
    )
  }
}
