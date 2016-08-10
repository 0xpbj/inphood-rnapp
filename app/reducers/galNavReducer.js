import { FEEDBACK_PHOTO, PUSH_GAL_ROUTE, POP_GAL_ROUTE } from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const defaultState = {
  index: 0,
  selected: '',
  key: 'root',
  routes: [
    {
      key: 'gallery',
      title: ''
    }
  ]
}

export default function galleryNav(state = defaultState, action) {
  switch(action.type) {
    case FEEDBACK_PHOTO:
      return {
        ...state,
        selected: action.selected
      }
    case PUSH_GAL_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) {
        return state
      }
      else {
        return NavigationStateUtils.push(state, action.route)
      }
    case POP_GAL_ROUTE:
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
