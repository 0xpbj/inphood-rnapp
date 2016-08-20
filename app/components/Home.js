import React, { Component } from 'react'
import { View, NavigationExperimental, BackAndroid, TabBarIOS } from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack,
  AnimatedView: NavigationAnimatedView,
  Header: NavigationHeader,
} = NavigationExperimental

import Icon from 'react-native-vector-icons/Ionicons'
import Login from './Login'
import Media from './Media'
import Gallery from '../containers/GalleryContainer'
import Expert from '../containers/ExpertGalleryContainer'
// import Expert from './ExpertGallery'

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
      case 'Camera':
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
      case 'Clients':
        return (
          <Expert />
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
          changeTab={(i)=>this.props.changeTab(i)}
        />
      )
    }
    if (this.props.auth.result === null) {
      return <Login
               loginRequest={()=>this.props.loginRequest()}
               logoutRequest={()=>this.props.logoutRequest()}
               storeToken={(action)=>this.props.storeToken(action)}
               storeResult={(action)=>this.props.storeResult(action)}
               auth={this.props.auth}
              />
    }
    const trainer = this.props.auth.trainer
    const tabs = this.props.tabs.routes.map((tab, i) => {
      if (i !== 3) {
        return (
          <Icon.TabBarItemIOS
            title={tab.title}
            iconName={tab.name}
            selectedIconName={tab.iconName}
            iconSize={40}
            onPress={() => {
                this.props.changeTab(i)
            }}
            selected={this.props.tabs.index === i}>
            {this._renderTabContent(tab.key)}
          </Icon.TabBarItemIOS>
        )
      }
      else if (trainer && i === 3) {
        return (
          <Icon.TabBarItemIOS
            title={tab.title}
            iconName={tab.name}
            selectedIconName={tab.iconName}
            iconSize={40}
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
