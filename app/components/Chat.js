import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat'

import CommonStyles from './styles/common-styles'
import Config from 'react-native-config'

const turlHead = Config.AWS_CDN_THU_URL

export default class ChatThread extends Component {
  constructor(props) {
    super(props)
    const feedbackPhoto = this.props.chat.feedbackPhoto
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const oldMessages = this.props.chat.previousMessages[photo]
    this.state = {
      messages: props.messages,
      isTyping: null,
      id: firebase.auth().currentUser.uid,
      oldMessages: oldMessages,
      loadEarlier: (oldMessages) ? true : false,
    }
    this.loadMessages = this.loadMessages.bind(this)
    this._isAlright = null
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps = {}) {
    this.loadMessages(nextProps)
  }
  componentWillMount() {
    if (this.state.loadEarlier) {
      this.loadMessages(this.props)
    }
  }
  loadMessages(props) {
    const feedbackPhoto = props.chat.feedbackPhoto
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const oldMessages = props.chat.previousMessages[photo]
    var messages = []
    for (var keys in oldMessages) {
      if (this.state.id !== oldMessages[keys].uid) {
        const path = '/global/' + oldMessages[keys].uid + '/messages/' + oldMessages[keys].photo + '/' + keys
        if (oldMessages[keys].trainerRead === false) {
          const photo = turlHead + oldMessages[keys].uid + '/' + oldMessages[keys].photo
          props.markMessageRead(path, true, photo)
        }
      }
      else {
        const path = '/global/' + oldMessages[keys].uid + '/messages/' + oldMessages[keys].photo + '/' + keys
        if (oldMessages[keys].clientRead === false) {
          const photo = turlHead + oldMessages[keys].uid + '/' + oldMessages[keys].photo
          props.markMessageRead(path, false, photo)
        }
      }
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
    const id = this.props.data.clientId
    if (id === '') {
      this.props.storeId(this.state.id)
    }
    else {
      this.props.storeId(id)
    }
    this.props.storeMessages(messages)
    this.props.initChatSaga()
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })
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
