import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import Chat from '../components/Chat'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    auth: state.authReducer,
    data: state.trainerReducer,
    chat: state.chatReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
