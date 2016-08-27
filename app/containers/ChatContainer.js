import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ClientChatThread from '../components/ClientChatThread'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    chat: state.clientChatReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientChatThread)
