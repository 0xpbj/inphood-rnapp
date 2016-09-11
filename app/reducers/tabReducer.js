import { CHANGE_TAB, MEDIA_TAB_VISIBLE, CHAT_TAB_VISIBLE, TRAINER_CHAT_TAB_VISIBLE } from '../constants/ActionTypes'
import {userIcon, sampleIcon, homeIcon} from '../components/Icons'

const tabs = [
  { key: 'Camera', icon: sampleIcon, title: 'Camera', name: 'ios-camera-outline', iconName: 'ios-camera'},
  { key: 'Home', icon: homeIcon, title: 'Home', name: 'ios-home-outline', iconName: 'ios-home'},
  { key: 'Expert', icon: homeIcon, title: 'Clients', name: 'ios-people-outline', iconName: 'ios-people'},
  { key: 'Extras', icon: sampleIcon, title: 'Extras', name: 'ios-options-outline', iconName: 'ios-options'},
]

const initialState = {
  index: 0,
  routes: tabs,
  mvisible: false,
  cvisible: false,
  evisible: false,
}

function tabsNav (state = initialState, action) {
  if (action.index === state.index) return state
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        index: action.index
      }
    case MEDIA_TAB_VISIBLE:
      return {
        ...state,
        mvisible: action.visible
      }
    case CHAT_TAB_VISIBLE:
      return {
        ...state,
        cvisible: action.visible
      }
    case TRAINER_CHAT_TAB_VISIBLE:
      return {
        ...state,
        evisible: action.visible
      }
    default:
      return state
  }
}

export default tabsNav
