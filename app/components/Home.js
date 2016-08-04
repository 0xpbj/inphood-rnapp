import React, { Component } from 'react'
import { View, NavigationExperimental, TabBarIOS } from 'react-native'
const { Reducer: NavigationReducer } = NavigationExperimental

import Login from './Login'
import Media from '../containers/MediaContainer'
import Home  from '../containers/GalleryContainer'

export default class HomeNavigationTabs extends Component {
  constructor(props) {
    super(props);
  }
  _renderTabContent (key) {
    switch (key) {
      case 'login':
        return <Login
                 loginRequest={()=>this.props.loginRequest()}
                 logoutRequest={()=>this.props.logoutRequest()}
                 storeToken={(action)=>this.props.storeToken(action)}
                 storeResult={(action)=>this.props.storeResult(action)}
                 auth={this.props.auth}
                />
      case 'media':
        return <Media
                 changeTab={(index) => this.props.changeTab(index)}
               />
      case 'home':
        return <Home
                 result={this.props.auth.result}
               />
      default:
        return <View />
    }
  }
  render () {
    const tabs = this.props.tabs.routes.map((tab, i) => {
      return (
        <TabBarIOS.Item key={tab.key}
          icon={tab.icon}
          selectedIcon={tab.selectedIcon}
          title={tab.title}
          onPress={() => this.props.changeTab(i)}
          selected={this.props.tabs.index === i}>
          {this._renderTabContent(tab.key)}
        </TabBarIOS.Item>
      )
    })
    return (
      <TabBarIOS
        unselectedTintColor="black"
        tintColor="#22a3ed"
        barTintColor="white"
      >
        {tabs}
      </TabBarIOS>
    )
  }
}
