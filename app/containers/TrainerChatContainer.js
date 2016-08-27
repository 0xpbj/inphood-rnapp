import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import TrainerChatThread from '../components/TrainerChatThread'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    chat: state.trainerChatReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrainerChatThread)
