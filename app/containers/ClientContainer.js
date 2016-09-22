import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Client from '../components/Client'
import * as actionCreators from '../actions/Actions'

function mapStateToProps(state) {
  return {
    trainer: state.trainerReducer,
    notification: state.notificationReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Client)
