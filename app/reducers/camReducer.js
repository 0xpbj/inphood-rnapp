import { TAKE_PHOTO, STORE_CAMERA_CAPTION, STORE_CAMERA_TITLE, ADD_CAMERA_MEAL_DATA, PUSH_CAM_ROUTE, POP_CAM_ROUTE } from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  photo: '',
  caption: '',
  title: '',
  mealType: '',
  index: 0,
  key: 'root',
  routes: [
    {
      key: 'picture',
      title: ''
    }
  ]
}

export default function camera (state = initialState, action) {
  switch (action.type) {
    case TAKE_PHOTO:
      return {
        ...state,
        photo: action.photo
      }
    case STORE_CAMERA_CAPTION:
      return {
        ...state,
        caption: action.caption
      }
    case STORE_CAMERA_TITLE:
      return {
        ...state,
        title: action.title
      }
    case ADD_CAMERA_MEAL_DATA:
      return {
        ...state,
        mealType: action.mealType
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
    default:
      return state
  }
}
