import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Photos from '../components/Photos'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    media: state.photoReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Photos)
