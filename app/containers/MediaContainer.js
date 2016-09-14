import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Media from '../components/Media'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    cnavigation: state.camNavReducer,
    camera: state.camReducer,
    lnavigation: state.libNavReducer,
    library: state.libReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Media)
