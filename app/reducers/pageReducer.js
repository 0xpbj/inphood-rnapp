import { CHANGE_PAGE } from '../constants/ActionTypes'

const initialState = {
  index: 0
}

function pageNav (state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        index: action.index
      }
    default:
      return state
  }
}

export default pageNav
