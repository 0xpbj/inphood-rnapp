import { 
  ADD_CLIENTS, ADD_PHOTOS, ADD_MESSAGES, ADD_INFOS,
  SET_CLIENT_ID, SET_CLIENT_PHOTO, SET_CLIENT_NAME,
  FEEDBACK_PHOTO, NUMBER_OF_CLIENTS
} from '../constants/ActionTypes'

const initialState = {
  infos: [],
  photos: [],
  clients: [],
  messages: [],
  numClients: 0,
  clientId: '',
  clientName: '',
  clientPhoto: '',
  feedbackPhoto: '',
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
    case ADD_PHOTOS:
      return {
        ...state,
        photos: [...state.photos, action.child]
      }
    case ADD_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.child]
      }
    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.id
      }
    case SET_CLIENT_NAME:
      return {
        ...state,
        clientName: action.name
      }
    case SET_CLIENT_PHOTO:
      return {
        ...state,
        clientPhoto: action.photo
      }
    case FEEDBACK_PHOTO:
      return {
        ...state,
        feedbackPhoto: action.feedbackPhoto
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