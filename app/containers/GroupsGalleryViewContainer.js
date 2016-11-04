import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GroupsGalleryView from '../components/GroupsGalleryView'
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
)(GroupsGalleryView)