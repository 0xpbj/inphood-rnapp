import { 
  INCREMENT_CLIENT_NOTIFICATION,
  DECREMENT_CLIENT_NOTIFICATION,
  INCREMENT_TRAINER_NOTIFICATION,
  DECREMENT_TRAINER_NOTIFICATION
} from '../constants/ActionTypes'

const initialState = {
  client: 0,
  trainer: 0,
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case INCREMENT_CLIENT_NOTIFICATION:
      return {
        ...state,
        client: state.client + 1
      }
    case DECREMENT_CLIENT_NOTIFICATION:
      if (state.client > 0) {
        return {
          ...state,
          client: state.client - 1
        }
      }
    case INCREMENT_TRAINER_NOTIFICATION:
      return {
        ...state,
        trainer: state.trainer + 1
      }
    case DECREMENT_TRAINER_NOTIFICATION:
      if (state.trainer > 0) {
        return {
          ...state,
          trainer: state.trainer - 1
        }
      }
    default:
      return state
  }
}
