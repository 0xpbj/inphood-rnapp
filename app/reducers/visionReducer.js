import { 
  CLARIFAI_TAGS_SUCCESS,
} from '../constants/ActionTypes'

const initialState = {
  tags: ''
}

export default function camera (state = initialState, action) {
  switch (action.type) {
    case CLARIFAI_TAGS_SUCCESS:
      return {
        ...state,
        tags: action.tags
      }
    default:
      return state
  }
}
