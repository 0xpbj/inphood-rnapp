import { 
  ADD_CLIENTS, NUMBER_OF_CLIENTS,
  ADD_INFOS, ADD_PHOTOS, ADD_MESSAGES, 
  LOGOUT_SUCCESS, REMOVE_PHOTO,
} from '../constants/ActionTypes'

import Config from '../constants/config-vars'
const turlHead = Config.AWS_CDN_THU_URL

const initialState = {
  infos: [],
  infoIds: [],
  photos: [],
  clients: [],
  messages: [],
  numClients: 0,
  cdnPaths: [],
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
        cdnPaths: [...state.cdnPaths, turlHead+action.fileName],
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
    case REMOVE_PHOTO:
      const index = state.databasePaths.indexOf(action.databasePath)
      if (index > -1) {
        let databasePaths = state.databasePaths
        databasePaths.splice(index, 1)
        let cdnPaths = state.cdnPaths
        cdnPaths.splice(index, 1)
        let photos = state.photos
        photos.splice(index, 1)
        return {
          ...state,
          photos: photos,
          cdnPaths: cdnPaths,
          databasePaths: databasePaths,
        }
      }
      else {
        return state
      }
    default:
      return state
  }
}