import { 
  SELECT_PHOTO, STORE_64_LIBRARY, CLARIFAI_TAGS_SUCCESS, 
  STORE_LIBRARY_CAPTION, STORE_LIBRARY_TITLE, ADD_LIBRARY_MEAL_DATA, 
  PUSH_LIB_ROUTE, POP_LIB_ROUTE, SEND_FIREBASE_INIT_LIBRARY, SEND_AWS_SUCCESS 
} from '../constants/ActionTypes'

import { NavigationExperimental } from 'react-native'

const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  selected: '',
  selected64: '',
  caption: '',
  title: '',
  count: 0,
  mealType: '',
  index: 0,
  key: 'root',
  tags: '',
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
    case SELECT_PHOTO:
      return {
        ...state,
        selected: action.selected,
        inProgress: null
      }
    case STORE_64_LIBRARY:
      return {
        ...state,
        selected64: action.selected
      }
    case CLARIFAI_TAGS_SUCCESS:
      return {
        ...state,
        tags: action.tags
      }
    case STORE_LIBRARY_CAPTION:
      return {
        ...state,
        caption: action.caption
      }
    case STORE_LIBRARY_TITLE:
      return {
        ...state,
        title: action.title
      }
    case ADD_LIBRARY_MEAL_DATA:
      return {
        ...state,
        mealType: action.mealType
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
    case SEND_FIREBASE_INIT_LIBRARY:
      return {
        ...state,
        inProgress: true
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
