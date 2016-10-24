import { 
  STORE_CAPTION, ADD_MEAL_DATA
} from '../constants/ActionTypes'

const initialState = {
  caption: '',
  mealType: ''
}

export default function camera (state = initialState, action) {
  switch (action.type) {
    case STORE_CAPTION:
      return {
        ...state,
        caption: action.caption
      }
    case ADD_MEAL_DATA:
      return {
        ...state,
        mealType: action.mealType
      }
    default:
      return state
  }
}
