import {
  INCREMENT_CLIENT_PHOTO_NOTIFICATION,
  DECREMENT_CLIENT_PHOTO_NOTIFICATION,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION,
  DECREMENT_TRAINER_PHOTO_NOTIFICATION,
} from '../constants/ActionTypes'

const initialState = {
  client: 0,
  trainer: 0,
  groups: 0,
  clientID: [],
  clientPhotos: [],
  galleryPhotos: [],
}

export default function notification (state = initialState, action) {
  let id = ''
  let count = 0
  let name = ''
  let idData = []
  let photoData = []
  let databasePath = ''
  switch (action.type) {
    case INCREMENT_CLIENT_PHOTO_NOTIFICATION:
      databasePath = action.databasePath
      photoData = state.galleryPhotos
      if(!photoData[databasePath])
        photoData[databasePath] = 0
      photoData[databasePath] = photoData[databasePath] + 1
      return {
        ...state,
        client: state.client + 1,
        galleryPhotos: photoData
      }
    case DECREMENT_CLIENT_PHOTO_NOTIFICATION:
      databasePath = action.databasePath
      photoData = state.galleryPhotos
      count = photoData[databasePath]
      photoData[databasePath] = 0
      return {
        ...state,
        client: state.client - count,
        galleryPhotos: photoData
      }
    case INCREMENT_TRAINER_PHOTO_NOTIFICATION:
      id = action.client
      databasePath = action.databasePath
      idData = state.clientID
      if(!idData[id])
        idData[id] = 0
      idData[id] = idData[id] + 1
      photoData = state.clientPhotos
      if(!photoData[databasePath])
        photoData[databasePath] = 0
      photoData[databasePath] = photoData[databasePath] + 1
      return {
        ...state,
        trainer: state.trainer + 1,
        clientPhotos: photoData,
        clientID: idData
      }
    case DECREMENT_TRAINER_PHOTO_NOTIFICATION:
      id = action.client
      databasePath = action.databasePath
      idData = state.clientID
      if(!idData[id])
        idData[id] = 0
      idData[id] = 0
      photoData = state.clientPhotos
      count = photoData[databasePath]
      photoData[databasePath] = 0
      return {
        ...state,
        trainer: state.trainer - count,
        clientPhotos: photoData,
        clientID: idData
      }
    default:
      return state
  }
}
