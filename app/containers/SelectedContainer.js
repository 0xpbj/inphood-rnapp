import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Selected from '../components/Selected'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    info: state.infoReducer,
    selected: state.selectedReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selected)
