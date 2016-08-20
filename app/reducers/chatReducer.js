import { FEEDBACK_PHOTO, STORE_MESSAGES, LOAD_MESSAGES_SUCCESS } from '../constants/ActionTypes'

const defaultState = {
  feedbackPhoto: '',
  messages: [],
  previousMessages: [],
}

export default function chat(state = defaultState, action) {
  switch(action.type) {
    case FEEDBACK_PHOTO:
      return {
        ...state,
        feedbackPhoto: action.feedbackPhoto
      }
    case STORE_MESSAGES:
      return {
        ...state,
        messages: action.messages
      }
    case LOAD_MESSAGES_SUCCESS:
      return {
        ...state,
        previousMessages: action.messages
      }
    default:
      return state
  }
}
