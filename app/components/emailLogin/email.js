'use strict'
import React, { Component } from 'react'
import { 
  Text,
  View,
  Navigator,
  AsyncStorage
} from 'react-native'

import Signup from './signup'
import Account from './account'
import Header from './header'
import styles from '../styles/common-styles.js'

export default class email extends Component {    
  constructor(props){
    super(props)
    this.state = {
      component: null,
      loaded: false
    }
  }
  componentWillMount() {
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json)
      let component = {component: Signup}
      if (user_data != null) {
        firebase.auth().authWithCustomToken(user_data.token, (error, authData) => {
          if (error) {
            this.setState(component)
          }
          else {
            this.setState({component: Account})
          }
        })
      }
      else{
        this.setState(component);
      }
    })
  }
  render () {
    if (this.state.component) {
      return (
        <Navigator
          initialRoute={{component: this.state.component}}
          configureScene={() => {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          renderScene={(route, navigator) => {
            if(route.component){
              return React.createElement(route.component, { navigator });
            }
          }}
        />
      )
    }
    else {
      return (
        <View style={styles.container}>
          <Header text="React Native Firebase Auth" loaded={this.state.loaded} />  
          <View style={styles.body}></View>
        </View>
      )
    }
  }
}