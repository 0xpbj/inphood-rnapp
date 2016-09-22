import { PUSH_EXT_ROUTE, POP_EXT_ROUTE, STORE_PROFILE_FORM, STORE_SETTINGS_FORM } from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  index: 0,
  key: 'root',
  routes: [
    {
      key: 'start',
      title: ''
    }
  ],
  profileForm: '',
  settingsForm: '',
}

export default function extrasNav(state = initialState, action) {
  switch(action.type) {
    case PUSH_EXT_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) {
        return state
      }
      else {
        return NavigationStateUtils.push(state, action.route)
      }
    case POP_EXT_ROUTE:
      if (state.index === 0 || state.routes.length === 1) {
        return state
      }
      else {
        return NavigationStateUtils.pop(state)
      }
    case STORE_PROFILE_FORM:
    console.log(action.form)
      return {
        ...state,
        profileForm: action.form
      }
    default:
      return state
  }
}
