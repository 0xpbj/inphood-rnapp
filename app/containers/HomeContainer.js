import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Home from '../components/Home'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    tabs: state.tabReducer,
    auth: state.authReducer,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
