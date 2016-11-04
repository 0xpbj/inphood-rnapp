import {
  INCREMENT_CLIENT_PHOTO_NOTIFICATION,
  DECREMENT_CLIENT_PHOTO_NOTIFICATION,
  INCREMENT_TRAINER_PHOTO_NOTIFICATION,
  DECREMENT_TRAINER_PHOTO_NOTIFICATION,
  INCREMENT_GROUP_NOTIFICATION,
  DECREMENT_GROUP_NOTIFICATION,
} from '../constants/ActionTypes'

const initialState = {
  client: 0,
  trainer: 0,
  groups: 0,
  clientUID: [],
  clientPhotos: [],
  groupArr: [],
  groupsPhotos: [],
  galleryPhotos: [],
}

export default function notification (state = initialState, action) {
  let uid = ''
  let count = 0
  let name = ''
  let uidData = []
  let groupArr = []
  let photoData = []
  let databasePath = ''
  switch (action.type) {
    case INCREMENT_GROUP_NOTIFICATION:
      databasePath = action.databasePath
      photoData = state.groupPhotos
      name = action.name
      groupArr = state.groupArr
      if(!groupArr[name])
        groupArr[name] = 0
      groupArr[name] = groupArr[name] + 1
      if(!photoData[databasePath])
        photoData[databasePath] = 0
      photoData[databasePath] = photoData[databasePath] + 1
      return {
        ...state,
        groups: state.groups + 1,
        groupArr: groupArr,
        groupPhotos: photoData
      }
    case DECREMENT_GROUP_NOTIFICATION:
      databasePath = action.databasePath
      photoData = state.groupPhotos
      name = action.name
      groupArr = state.clientUID
      if(!groupArr[name])
        groupArr[name] = 0
      groupArr[name] = 0
      count = photoData[databasePath]
      photoData[databasePath] = 0
      return {
        ...state,
        groups: state.groups - count,
        groupArr: groupArr,
        groupPhotos: photoData
      }
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
