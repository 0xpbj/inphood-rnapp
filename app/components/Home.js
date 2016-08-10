import React, { Component } from 'react'
import { View, NavigationExperimental, BackAndroid, TabBarIOS } from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Login from './Login'
import Gallery from '../containers/GalleryContainer'

const route1 = {
  type: 'push',
  route: {
    key: 'media',
    title: ''
  }
}

const route2 = {
  type: 'push',
  route: {
    key: 'gallery',
    title: ''
  }
}

export default class HomeTabs extends Component {
  constructor(props) {
    super(props);
  }
  _renderTabContent (key) {
    switch (key) {
      case 'home':
        return <Login
                 loginRequest={()=>this.props.loginRequest()}
                 logoutRequest={()=>this.props.logoutRequest()}
                 storeToken={(action)=>this.props.storeToken(action)}
                 storeResult={(action)=>this.props.storeResult(action)}
                 auth={this.props.auth}
                />
      // case 'home':
        // return <Gallery
        //         result={this.props.auth.result}/>
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
          onPress={() => {
            if (i === 1) {
              this.props._handleNavigate(route1)
            }
            else if (i === 2) {
              this.props._handleNavigate(route2)
            }
            else {
              this.props.changeTab(i)
            }
          }}
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
