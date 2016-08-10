import { CHANGE_TAB, CHANGE_CAM_TAB } from '../constants/ActionTypes'
import {userIcon, sampleIcon, homeIcon} from '../data/icons'
const tabs = [
  { key: 'home', icon: homeIcon, title: 'Home' },
  { key: 'media', icon: sampleIcon, title: 'Media' },
  { key: 'gallery', icon: userIcon, title: 'Profile' },
]

const initialState = {
  index: 0,
  routes: tabs
}

function tabsNav (state = initialState, action) {
  if (action.index === state.index) return state
  switch (action.type) {
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
