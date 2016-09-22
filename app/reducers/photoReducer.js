import { TAKE_PHOTO } from '../constants/ActionTypes'

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
    default:
      return state
  }
}