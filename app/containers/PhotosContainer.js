import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CameraRollPicker from '../components/CameraRollPicker'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    media: state.photoReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraRollPicker)
