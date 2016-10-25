import { 
  RESET_CAMERA, SEND_FIREBASE_CAMERA_SUCCESS, PUSH_CAM_ROUTE, POP_CAM_ROUTE, SEND_FIREBASE_INIT_CAMERA
} from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  index: 0,
  key: 'root',
  routes: [
    {
      key: 'picture',
      title: ''
    }
  ],
  inProgress: null
}

export default function media (state = initialState, action) {
  switch (action.type) {
    case SEND_FIREBASE_INIT_CAMERA:
      return {
        ...state
      }
    case RESET_CAMERA:
      return {
        ...state,
        inProgress: null
      }
    case PUSH_CAM_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) {
        return state
      }
      else {
        return NavigationStateUtils.push(state, action.route)
      }
    case POP_CAM_ROUTE:
      if (state.index === 0 || state.routes.length === 1) {
        return state
      }
      else {
        return NavigationStateUtils.pop(state)
      }
    case SEND_FIREBASE_CAMERA_SUCCESS:
      return {
        ...state,
        inProgress: false
      }
    default:
      return state
  }
}
