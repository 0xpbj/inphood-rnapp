import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Extras from '../components/Extras'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    info: state.infoReducer,
    extras: state.extReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Extras)
