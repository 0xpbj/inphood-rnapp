import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import Chat from '../components/Chat'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    info: state.infoReducer,
    data: state.clientDataReducer,
    chat: state.chatReducer,
    gallery: state.galReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
