import React, { Component } from 'react'
import {Platform} from 'react-native'

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'

import Media from '../containers/MediaContainer'
import Home from '../containers/HomeContainer'
import Extras from '../containers/ExtrasContainer'

export default class App extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
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
