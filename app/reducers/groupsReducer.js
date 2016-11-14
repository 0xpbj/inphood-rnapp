import { 
  ADD_GROUPS, NUMBER_OF_GROUPS,
  ADD_GROUP_INFOS, ADD_GROUP_PHOTOS,
  ADD_GROUP_MESSAGES, REMOVE_GROUP_PHOTO, 
  CREATE_GROUP, FEEDBACK_PHOTO, SET_GROUP_NAME,
} from '../constants/ActionTypes'

import Config from 'react-native-config'
const turlHead = Config.AWS_CDN_THU_URL

const initialState = {
  id: '',
  name: '',
  infos: [],
  groups: [],
  photos: [],
  infoIds: [],
  messages: [],
  numGroups: 0,
  cdnPaths: [],
  groupName: '',
  groupNames: [],
  groupPhoto: '',
  databasePaths: [],
  groupInvitees: [],
  feedbackPhoto: '',
}

export default function groups (state = initialState, action) {
  switch (action.type) {
    case ADD_GROUPS:
      return {
        ...state,
        groupNames: [...state.groupNames, action.name],
        groupInvitees: [...state.groupInvitees, action.invitee]
      }
    case ADD_GROUP_INFOS:
      return {
        ...state,
        infos: [...state.infos, action.child],
        infoIds: [...state.infoIds, action.child.id]
      }
    case ADD_GROUP_PHOTOS:
      return {
        ...state,
        databasePaths: [...state.databasePaths, action.databasePath],
        cdnPaths: [...state.cdnPaths, turlHead+action.fileName],
        photos: [...state.photos, action.child]
      }
    case ADD_GROUP_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.child]
      }
    case NUMBER_OF_GROUPS:
      return {
        ...state,
        numGroups: action.count
      }
    case REMOVE_GROUP_PHOTO:
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
    case CREATE_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.value]
      }
    case SET_GROUP_NAME:
      return {
        ...state,
        groupName: action.name,
        groupPhoto: action.photo
      }
    case FEEDBACK_PHOTO:
      return {
        ...state,
        feedbackPhoto: action.feedbackPhoto
      }
    default:
      return state
  }
}
