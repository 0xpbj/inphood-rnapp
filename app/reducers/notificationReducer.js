import { 
  INCREMENT_CLIENT_NOTIFICATION,
  DECREMENT_CLIENT_NOTIFICATION,
  INCREMENT_TRAINER_NOTIFICATION,
  DECREMENT_TRAINER_NOTIFICATION,
  INCREMENT_CLIENT_CHAT_NOTIFICATION,
  DECREMENT_CLIENT_CHAT_NOTIFICATION,
  INCREMENT_TRAINER_CHAT_NOTIFICATION,
  DECREMENT_TRAINER_CHAT_NOTIFICATION
} from '../constants/ActionTypes'

const initialState = {
  client: 0,
  trainer: 0,
  clientUID: [],
  trainerUID: [],
  clientPhotos: [],
  trainerPhotos: []
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case INCREMENT_CLIENT_NOTIFICATION:
      let cuid1 = state.clientUID
      if(cuid1[action.uid]) {
        cuid1[action.uid] = cuid1[action.uid] + 1
      }
      else {
        cuid1[action.uid] = 1
      }
      return {
        ...state,
        client: state.client + 1,
        clientUID: cuid1
      }
    case DECREMENT_CLIENT_NOTIFICATION:
      let cuid2 = state.clientUID
      cuid2[action.uid] = 0
      if (state.client > 0) {
        return {
          ...state,
          client: state.client - 1,
          clientUID: cuid2
        }
      }
      else {
        return state
      }
    case INCREMENT_TRAINER_NOTIFICATION:
      let tuid = state.clientUID
      if(tuid[action.uid]) {
        tuid[action.uid] = tuid[action.uid] + 1
      }
      else {
        tuid[action.uid] = 1
      }
      return {
        ...state,
        trainer: state.trainer + 1,
        trainerUID: tuid
      }
    case DECREMENT_TRAINER_NOTIFICATION:
      if (state.trainer > 0) {
        return {
          ...state,
          trainer: state.trainer - 1
        }
      }
      else {
        return state
      }
    case INCREMENT_CLIENT_CHAT_NOTIFICATION:
      let data1 = state.clientPhotos
      if (data1[action.photo]) {
        data1[action.photo] = data1[action.photo] + 1
      }
      else {
        data1[action.photo] = 1
      }
      return {
        ...state,
        clientPhotos: data1
      }
    case DECREMENT_CLIENT_CHAT_NOTIFICATION:
      let data2 = state.clientPhotos
      data2[action.photo] = 0
      return {
        ...state,
        clientPhotos: data2
      }
    case INCREMENT_TRAINER_CHAT_NOTIFICATION:
      let data3 = state.trainerPhotos
      if (data3[action.photo]) {
        data3[action.photo] = data3[action.photo] + 1
      }
      else {
        data3[action.photo] = 1
      }
      return {
        ...state,
        trainerPhotos: data3
      }
    case DECREMENT_TRAINER_CHAT_NOTIFICATION:
      let data4 = state.trainerPhotos
      data4[action.photo] = 0
      return {
        ...state,
        trainerPhotos: data4
      }
    default:
      return state
  }
}
