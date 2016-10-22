import { 
  STORE_CAMERA_CAPTION, ADD_CAMERA_MEAL_DATA,
  STORE_LIBRARY_CAPTION, ADD_LIBRARY_MEAL_DATA,
} from '../constants/ActionTypes'

const initialState = {
  camCaption: '',
  camMealType: '',
  libCaption: '',
  libMealType: ''
}

export default function camera (state = initialState, action) {
  switch (action.type) {
    case STORE_CAMERA_CAPTION:
      return {
        ...state,
        camCaption: action.caption
      }
    case STORE_LIBRARY_CAPTION:
      return {
        ...state,
        libCaption: action.caption
      }
    case ADD_CAMERA_MEAL_DATA:
      return {
        ...state,
        camMealType: action.mealType
      }
    case ADD_LIBRARY_MEAL_DATA:
      return {
        ...state,
        libMealType: action.mealType
      }
    default:
      return state
  }
}
