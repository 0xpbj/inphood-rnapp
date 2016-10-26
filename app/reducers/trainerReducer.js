import { 
  ADD_CLIENTS, NUMBER_OF_CLIENTS,
  ADD_INFOS, ADD_PHOTOS, ADD_MESSAGES, 
  LOGOUT_SUCCESS,
} from '../constants/ActionTypes'

const initialState = {
  infos: [],
  infoIds: [],
  photos: [],
  clients: [],
  messages: [],
  numClients: 0,
  databasePaths: [],
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
        infos: [...state.infos, action.child],
        infoIds: [...state.infoIds, action.child.id]
      }
    case ADD_PHOTOS:
      return {
        ...state,
        databasePaths: [...state.databasePaths, action.databasePath],
        photos: [...state.photos, action.child]
      }
    case ADD_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.child]
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