import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Gallery from '../components/Gallery'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    galleryNav: state.galNavReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery)
