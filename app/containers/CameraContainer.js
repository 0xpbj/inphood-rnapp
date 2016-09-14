import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Camera from '../components/Camera'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    camera: state.camReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera)
