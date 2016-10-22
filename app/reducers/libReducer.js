import { 
  TAKE_PHOTO, RESET_LIBRARY, PUSH_LIB_ROUTE, POP_LIB_ROUTE, SEND_AWS_SUCCESS, SEND_FIREBASE_INIT_LIBRARY
} from '../constants/ActionTypes'

import { NavigationExperimental } from 'react-native'

const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  count: 0,
  index: 0,
  key: 'root',
  routes: [
    {
      key: 'photos',
      title: ''
    }
  ],
  inProgress: null
}

export default function library (state = initialState, action) {
  switch (action.type) {
    case TAKE_PHOTO:
      return {
        ...state,
        count: state.count + 1
      }
    case SEND_FIREBASE_INIT_LIBRARY:
      return {
        ...state,
        inProgress: true
      }
    case RESET_LIBRARY:
      return {
        ...state,
        inProgress: null
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
    case SEND_AWS_SUCCESS:
      return {
        ...state,
        inProgress: false
      }
    default:
      return state
  }
}
