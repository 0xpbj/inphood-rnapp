import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Library from '../components/Library'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    library: state.libReducer,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library)
