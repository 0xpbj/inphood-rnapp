import { CHANGE_TAB } from '../constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
const tabs = [
  // { key: 'Media', title: 'Camera', name: 'ios-camera-outline', iconName: 'ios-camera'},
  { key: 'Home', title: 'Home', name: 'ios-home-outline', iconName: 'ios-home'},
  { key: 'Clients', title: 'Clients', name: 'ios-people-outline', iconName: 'ios-people'},
  { key: 'Extras', title: 'Extras', name: 'ios-options-outline', iconName: 'ios-options'},
]

const initialState = {
  index: 0,
  routes: tabs
}

function tabsNav (state = initialState, action) {
  if (action.index === state.index) return state
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        index: 0
      }
    case CHANGE_TAB:
      return {
        ...state,
        index: action.index
      }
    default:
      return state
  }
}

export default tabsNav
