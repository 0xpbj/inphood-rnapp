import { CLIENT_FEEDBACK_PHOTO, CLIENT_STORE_MESSAGES, CLIENT_LOAD_MESSAGES, CLIENT_ADD_MESSAGES } from '../constants/ActionTypes'

const defaultState = {
  feedbackPhoto: '',
  messages: [],
  previousMessages: [],
  loadEarlier: true
}

export default function chat(state = defaultState, action) {
  switch(action.type) {
    case CLIENT_FEEDBACK_PHOTO:
      return {
        ...state,
        feedbackPhoto: action.feedbackPhoto
      }
    case CLIENT_STORE_MESSAGES:
      return {
        ...state,
        messages: action.messages
      }
    case CLIENT_LOAD_MESSAGES:
      return {
        ...state,
        previousMessages: action.messages
      }
    case CLIENT_ADD_MESSAGES:
      let messages = state.previousMessages
      messages[action.photo] = action.messages
      return {
        ...state,
        previousMessages: messages
      }
    default:
      return state
  }
}
