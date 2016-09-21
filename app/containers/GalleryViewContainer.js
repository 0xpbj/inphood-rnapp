import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GalleryView from '../components/GalleryListView'
import * as actionCreators from '../actions/Actions'

function mapStateToProps (state) {
  return {
    auth: state.authReducer,
    galleryView: state.galReducer,
    notification: state.notificationReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryView)
