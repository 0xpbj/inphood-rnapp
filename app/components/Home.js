import React, { Component } from 'react'
import { View, NavigationExperimental, TabBarIOS } from 'react-native'
const { Reducer: NavigationReducer } = NavigationExperimental

import Login from './Login'
import Media from './Media'
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
                 loadPhotosInit={()=>this.props.loadPhotosInit()}
                 auth={this.props.auth}
                />
      case 'media':
        return <Media />
      case 'home':
        return <Home  />
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
        tintColor='black'
      >
        {tabs}
      </TabBarIOS>
    )
  }
}
