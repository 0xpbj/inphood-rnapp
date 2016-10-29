import React, { Component } from 'react'

import PushNotification from 'react-native-push-notification'

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

import Media from '../containers/MediaContainer'
import Home from '../containers/HomeContainer'
import Extras from '../containers/ExtrasContainer'

export default class App extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function(token) {
      //     console.log( 'TOKEN:', token );
      // },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          console.log( 'NOTIFICATION:', notification );
      },
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
      // senderID: "YOUR GCM SENDER ID",
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    })
  }
  handleChangeTab({i, ref, from}) {
    this.props.changePage(i)
  }
  render () {
    console.disableYellowBox = true
    let locked = false
    if (this.props.tabs.index > 0 || this.props.gallery.index > 0 || this.props.media.index > 0) {
      locked = true
    }
    if (this.props.auth.result === null) {
      return <Extras />
    }
    return (
      <ScrollableTabView
        tabBarPosition="bottom"
        page={this.props.page.index}
        locked={locked}
        onChangeTab={this.handleChangeTab.bind(this)}
        prerenderingSiblingsNumber={1}
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