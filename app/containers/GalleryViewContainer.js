import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GalleryView from '../components/GalleryListView'
import * as actionCreators from '../actions/Actions';

function mapStateToProps (state) {
  return {
    galleryView: state.galReducer
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryView)
