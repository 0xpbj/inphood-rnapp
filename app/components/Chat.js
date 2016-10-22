import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'

import CommonStyles from './styles/common-styles'
import firebase from 'firebase'
import Config from '../constants/config-vars'

const turlHead = Config.AWS_CDN_THU_URL

export default class ChatThread extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: props.messages,
      isTyping: null,
      id: firebase.auth().currentUser.uid,
      oldMessages: [],
      loadEarlier: false,
    }
    this.loadMessages = this.loadMessages.bind(this)
    this._isAlright = null
  }
  componentWillReceiveProps(nextProps = {}) {
    this.loadMessages()
  }
  loadMessages() {
    let oldMessages = this.props.chat.messages[this.props.chat.databasePath]
    var messages = []
    for (var keys in oldMessages) {
      let message = oldMessages[keys].message
      message.createdAt = oldMessages[keys].createdAt
      messages.unshift(message)
    }
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
        loadEarlier: false
      }
    })
  }
  onSend(messages = []) {
    if (this.props.caller === "trainer") {
      this.props.storeId(this.props.data.clientId)
    }
    else if (this.props.caller === "client") {
      this.props.storeId(this.state.id)
    }
    this.props.storeMessages(messages)
    this.props.initChatSaga()
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }
  renderFooter(props) {
    if (this.state.isTyping) {
      return (
        <View style={CommonStyles.footerContainer}>
          <Text style={CommonStyles.footerText}>
            {this.state.isTyping}
          </Text>
        </View>
      );
    }
    return null;
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 10}}/>
        <View style={{flex: 83}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend.bind(this)}
            loadEarlier={this.state.loadEarlier}
            user={{
              _id: this.state.id,
              name: this.props.result.first_name,
              avatar: this.props.result.picture,
            }}
            renderBubble={this.renderBubble.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
          />
        </View>
        <View style={{flex: 7}}/>
      </View>
    )
  }
}
