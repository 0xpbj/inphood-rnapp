import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Gallery from '../components/Gallery'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    gallery: state.galReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery)
