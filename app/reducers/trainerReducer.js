import { LOAD_CLIENTS_PHOTOS, LOAD_CLIENTS_LIST, SET_CLIENT_PHOTO, SET_CLIENT_ID, SET_CLIENT_NAME } from '../constants/ActionTypes'

const initialState = {
  clients: [],
  clientId: '',
  clientPhoto: '',
  clientName: '',
  clientsPhotos: [],
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case LOAD_CLIENTS_LIST:
      return {
        ...state,
        clients: action.clients
      }
    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.id
      }
    case SET_CLIENT_PHOTO:
      return {
        ...state,
        clientPhoto: action.photo
      }
    case SET_CLIENT_NAME:
      return {
        ...state,
        clientName: action.name
      }
    case LOAD_CLIENTS_PHOTOS:
      return {
        ...state,
        clientsPhotos: action.clientsPhotos
      }
    default:
      return state
  }
}
