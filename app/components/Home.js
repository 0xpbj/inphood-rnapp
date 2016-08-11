import React, { Component } from 'react'
import { View, NavigationExperimental, BackAndroid, TabBarIOS } from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Login from './Login'
import Media from './Media'
import Gallery from '../containers/GalleryContainer'

export default class HomeTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cvisible: false,
      mvisible: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      cvisible: nextProps.tabs.cvisible,
      mvisible: nextProps.tabs.mvisible,
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
      case 'Media':
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
      default:
        return <View />
    }
  }
  render () {
    const {cvisible, mvisible} = this.state
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
          baseHandleBackAction={this.props._handleBackAction}
          changeTab={(i)=>this.props.changeTab(i)}
        />
      )
    }
    const tabs = this.props.tabs.routes.map((tab, i) => {
      return (
        <TabBarIOS.Item key={tab.key}
          icon={tab.icon}
          selectedIcon={tab.selectedIcon}
          title={tab.title}
          onPress={() => {
              this.props.changeTab(i)
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
        translucent={true}
      >
        {tabs}
      </TabBarIOS>
    )
  }
}
