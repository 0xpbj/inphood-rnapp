import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Media from '../components/Media'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    media: state.mediaReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Media)
