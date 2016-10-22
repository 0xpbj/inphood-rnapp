import {
  INCREMENT_CLIENT_PHOTO_NOTIFICATION,
  DECREMENT_CLIENT_PHOTO_NOTIFICATION,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION,
  DECREMENT_TRAINER_PHOTO_NOTIFICATION,
} from '../constants/ActionTypes'

const initialState = {
  client: 0,
  trainer: 0,
  clientUID: [],
  clientPhotos: [],
  galleryPhotos: [],
}

export default function notification (state = initialState, action) {
  let uid = ''
  let count = 0
  let uidData = []
  let photoData = []
  let databasePath = ''
  let clientPhotos = []
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
      uid = action.client
      databasePath = action.databasePath
      uidData = state.clientUID
      if(!uidData[uid])
        uidData[uid] = 0
      uidData[uid] = uidData[uid] + 1
      photoData = state.clientPhotos
      if(!photoData[databasePath])
        photoData[databasePath] = 0
      photoData[databasePath] = photoData[databasePath] + 1
      return {
        ...state,
        trainer: state.trainer + 1,
        clientPhotos: photoData,
        clientUID: uidData
      }
    case DECREMENT_TRAINER_PHOTO_NOTIFICATION:
      uid = action.client
      databasePath = action.databasePath
      uidData = state.clientUID
      if(!uidData[uid])
        uidData[uid] = 0
      uidData[uid] = 0
      photoData = state.clientPhotos
      count = photoData[databasePath]
      photoData[databasePath] = 0
      return {
        ...state,
        trainer: state.trainer - count,
        clientPhotos: photoData,
        clientUID: uidData
      }
    default:
      return state
  }
}
