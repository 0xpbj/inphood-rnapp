import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Start from '../components/Start'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    auth: state.authReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Start)
