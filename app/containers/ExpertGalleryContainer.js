import {
  connect
} from 'react-redux'
import {
  bindActionCreators
} from 'redux'
import ExpertGallery from '../components/ExpertGallery'
import * as actionCreators from '../actions/Actions'

function mapStateToProps(state) {
  return {
    trainerData: state.trainerReducer,
    trainerNav: state.trainerNavReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpertGallery)
