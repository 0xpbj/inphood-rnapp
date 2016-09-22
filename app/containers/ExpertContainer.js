import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Expert from '../components/Expert'
import * as actionCreators from '../actions/Actions'

function mapStateToProps(state) {
  return {
    trainerNav: state.trainerNavReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Expert)
