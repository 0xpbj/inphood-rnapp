import React, { Component } from 'react'
import {
  View,
  Text,
  BackAndroid,
  TouchableOpacity,
} from 'react-native'

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
        let showNotification = <View />
        if (tab === 'ios-home') {
          showNotification = this.props.homeCount ? (
            <View style={CommonStyles.tabNotificationView}>
              <Text style={CommonStyles.tabNotificationText}>{this.props.homeCount}</Text>
            </View>
          ) : <View />
        }
        else if (tab === 'ios-people') {
          showNotification = this.props.clientCount ? (
            <View style={CommonStyles.tabNotificationView}>
              <Text style={CommonStyles.tabNotificationText}>{this.props.clientCount}</Text>
            </View>
          ) : <View />
        }
        return (
          <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={CommonStyles.tab}>
            <View>
              <Icon
                name={tab}
                size={40}
                color={this.props.activeTab === i ? '#006400' : 'rgb(204,204,204)'}
                ref={(icon) => { this.tabIcons[i] = icon }}
              />
              {showNotification}
            </View>
          </TouchableOpacity>
        )
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
          <Gallery />
        )
      case 'Clients':
        return (
          <Clients />
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
  render () {
    const trainerNotificationCount = this.props.notification.trainer > 0 ? this.props.notification.trainer : undefined
    const clientNotificationCount = this.props.notification.client > 0 ? this.props.notification.client : undefined
    const trainer = this.props.trainer.clients.length > 0
    const tabs = this.props.tabs.routes.map((tab, i) => {
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
        renderTabBar={() => <HomeTabBar clientCount={trainerNotificationCount} homeCount={clientNotificationCount}/>}
      >
        {tabs}
      </ScrollableTabView>
    )
  }
}
