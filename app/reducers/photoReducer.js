import { TAKE_PHOTO, LOGOUT_SUCCESS } from '../constants/ActionTypes'

const initialState = {
  count: 0
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case TAKE_PHOTO:
      return {
        ...state,
        count: state.count + 1
      }
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
