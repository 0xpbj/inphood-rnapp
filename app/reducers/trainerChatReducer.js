import { TRAINER_FEEDBACK_PHOTO, TRAINER_STORE_MESSAGES, TRAINER_LOAD_MESSAGES } from '../constants/ActionTypes'

const defaultState = {
  feedbackPhoto: '',
  messages: [],
  previousMessages: [],
}

export default function chat(state = defaultState, action) {
  switch(action.type) {
    case TRAINER_FEEDBACK_PHOTO:
      return {
        ...state,
        feedbackPhoto: action.feedbackPhoto
      }
    case TRAINER_STORE_MESSAGES:
      return {
        ...state,
        messages: action.messages
      }
    case TRAINER_LOAD_MESSAGES:
      return {
        ...state,
        previousMessages: action.messages
      }
    default:
      return state
  }
}
