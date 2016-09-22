import { 
  ADD_CLIENTS, ADD_INFOS, NUMBER_OF_CLIENTS, 
} from '../constants/ActionTypes'

const initialState = {
  infos: [],
  clients: [],
  numClients: 0,
}

export default function trainer (state = initialState, action) {
  switch (action.type) {
    case ADD_CLIENTS:
      return {
        ...state,
        clients: [...state.clients, action.child]
      }
    case ADD_INFOS:
      return {
        ...state,
        infos: [...state.infos, action.child]
      }
    case NUMBER_OF_CLIENTS:
      return {
        ...state,
        numClients: action.count
      }
    default:
      return state
  }
}