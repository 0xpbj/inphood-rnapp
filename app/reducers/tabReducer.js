import { CHANGE_TAB, SETTINGS_VIEW } from '../constants/ActionTypes'
const tabs = [
  { key: 'ios-home', title: 'Home', label: 'ios-home', iconName: 'ios-home'},
  { key: 'ios-people', title: 'Clients', label: 'ios-people', iconName: 'ios-people'},
  { key: 'ios-school', title: 'Groups', label: 'ios-school', iconName: 'ios-school'},
  { key: 'ios-options', title: 'Extras', label: 'ios-options', iconName: 'ios-options'},
]

const initialState = {
  index: 0,
  routes: tabs,
  settings: false
}

function tabsNav (state = initialState, action) {
  if (action.index === state.index) return state
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        index: action.index
      }
    case SETTINGS_VIEW:
      return {
        ...state,
        settings: action.flag
      }
    default:
      return state
  }
}

export default tabsNav
