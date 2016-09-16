import { 
  FEEDBACK_PHOTO, 
  STORE_MESSAGES, 
  LOAD_MESSAGES,
  ADD_MESSAGES,
  LOAD_ID
} from '../constants/ActionTypes'

const defaultState = {
  client: '',
  feedbackPhoto: '',
  messages: [],
  previousMessages: new Set()
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
    case LOAD_MESSAGES:
      return {
        ...state,
        previousMessages: action.messages
      }
    case LOAD_ID:
      return {
        ...state,
        client: action.id
      }
    case ADD_MESSAGES:
      const {photo, messages} = action
      let array = state.previousMessages
      if (!array[photo]) {
        array[photo] = []
      }
      array[photo] = [...array[photo], messages]
      return {
        ...state,
        previousMessages: array
      }
    default:
      return state
  }
}