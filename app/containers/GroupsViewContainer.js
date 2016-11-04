import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GroupsView from '../components/GroupsView'
import * as actionCreators from '../actions/Actions'

function mapStateToProps(state) {
  return {
    groups: state.groupsReducer,
    notification: state.notificationReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsView)