import { LOAD_CAMERAMEDIA_SUCCESS, SELECT_PHOTO, STORE_LIBRARY_CAPTION, ADD_LIBRARY_MEAL_DATA, PUSH_LIB_ROUTE, POP_LIB_ROUTE  } from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  selected: '',
  caption: '',
  count: 0,
  mealData: {},
  index: 0,
  key: 'root',
  routes: [
    {
      key: 'photos',
      title: ''
    }
  ]
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case SELECT_PHOTO:
      return {
        ...state,
        selected: action.selected
      }
    case STORE_LIBRARY_CAPTION:
      return {
        ...state,
        caption: action.caption
      }
    case ADD_LIBRARY_MEAL_DATA:
      return {
        ...state,
        mealData: action.mealData
      }
    case PUSH_LIB_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) {
        return state
      }
      else {
        return NavigationStateUtils.push(state, action.route)
      }
    case POP_LIB_ROUTE:
      if (state.index === 0 || state.routes.length === 1) {
        return state
      }
      else {
        return NavigationStateUtils.pop(state)
      }
    default:
      return state
  }
}
