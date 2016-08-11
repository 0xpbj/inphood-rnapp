import { CHANGE_TAB, MEDIA_TAB_VISIBLE, CHAT_TAB_VISIBLE } from '../constants/ActionTypes'
import {userIcon, sampleIcon, homeIcon} from '../components/Icons'

const tabs = [
  { key: 'Login', icon: userIcon, title: 'Login' },
  { key: 'Media', icon: sampleIcon, title: 'Media' },
  { key: 'Home', icon: homeIcon, title: 'Home' },
]

const initialState = {
  index: 0,
  routes: tabs,
  mvisible: false,
  cvisible: false,
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
    default:
      return state
  }
}

export default tabsNav
