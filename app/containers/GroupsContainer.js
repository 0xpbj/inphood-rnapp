import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Groups from '../components/Groups'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    groupsNav: state.groupsNavReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups)
