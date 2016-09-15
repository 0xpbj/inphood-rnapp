import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ClientGallery from '../components/ClientGallery'
import * as actionCreators from '../actions/Actions'

function mapStateToProps(state) {
  return {
    trainerData: state.trainerReducer,
    notification: state.notificationReducer
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientGallery)