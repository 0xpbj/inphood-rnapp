import { 
  FEEDBACK_PHOTO, SET_CLIENT_ID, SET_CLIENT_PHOTO, SET_CLIENT_NAME,
} from '../constants/ActionTypes'

const initialState = {
  clientId: '',
  clientName: '',
  clientPhoto: '',
  feedbackPhoto: '',
}

export default function trainerData (state = initialState, action) {
  switch (action.type) {
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
    default:
      return state
  }
}
