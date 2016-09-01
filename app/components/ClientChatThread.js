import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';

export default class ClientChatThread extends Component {
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
    this.onSend = this.onSend.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this._isAlright = null
  }
  componentDidMount() {
    this.props.chatVisible(true)
  }
  componentWillReceiveProps(nextProps = {}) {
    // const feedbackPhoto = nextProps.chat.feedbackPhoto
    // const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    // const lastMessage = nextProps.chat.lastMessage
    // console.log(lastMessage.key, lastMessage.val())
    // var messages = []
    // // let message = lastMessage.message
    // // message.createdAt = lastMessage.createdAt
    // // messages.push(message)
    // this.setState((previousState) => {
    //   return {
    //     messages: GiftedChat.append(previousState.messages, messages)
    //   }
    // })
  }
  onLoadEarlier() {
    const feedbackPhoto = this.props.chat.feedbackPhoto
    const photo = feedbackPhoto.substring(feedbackPhoto.lastIndexOf('/')+1, feedbackPhoto.lastIndexOf('.'))
    const oldMessages = this.props.chat.previousMessages[photo]
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
    this.props.clientStoreMessages(messages)
    this.props.initChatSaga()
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })
  }
  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
        loadEarlier: false,
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
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.isTyping}
          </Text>
        </View>
      );
    }
    return null;
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        onReceive={this.onReceive}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        user={{
          _id: this.state.id, // sent messages should have same user._id,
          name: this.props.result.first_name,
          avatar: this.props.result.picture.data.url,
        }}
        renderBubble={this.renderBubble}
        renderFooter={this.renderFooter}
      />
    )
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
