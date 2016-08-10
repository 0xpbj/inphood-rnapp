import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ChatThread from '../components/ChatThread'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    chat: state.chatReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatThread)
