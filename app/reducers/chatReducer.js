import { STORE_IMAGE_DATA, STORE_USER_MESSAGES, STORE_TRAINER_MESSAGES } from '../constants/ActionTypes'

const defaultState = {
  messages: [],
  trainerMessages: [],
  imageData: [],
}

export default function chat(state = defaultState, action) {
  switch(action.type) {
    case STORE_IMAGE_DATA:
      return {
        ...state,
        imageData: action.imageData
      }
    case STORE_USER_MESSAGES:
      let uarray = state.messages
      uarray.push.apply(uarray, action.messages)
      return {
        ...state,
        messages: uarray
      }
    case STORE_TRAINER_MESSAGES:
      let tarray = state.trainerMessages
      tarray.push.apply(tarray, action.trainerMessages)
      return {
        ...state,
        trainerMessages: tarray
      }
    default:
      return state
  }
}
