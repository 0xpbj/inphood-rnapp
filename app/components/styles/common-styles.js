'use strict'
import {StyleSheet, Platform} from "react-native"

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0

module.exports = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 30,
    width: 180,
    backgroundColor: '#006400',
    borderColor: '#006400',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    justifyContent: 'center'
  },
  // TODO: unify this with other styles (i.e. 14 is our default font)
  buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },

  containerImage: {
    flex: 1,
    resizeMode: 'contain',
    //  The null assignments below causes the renderer to re-determine size (which was broken
    // when the push direct to the camera view was implemented).
    height: null,
    width: null,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 10,
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    marginTop: 150,
    alignSelf: 'center'
  },

  captionContainer: {
    flex: 1,
    zIndex: 3,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  captionSwitchGroup: {
    flexDirection: 'row',
    flex: 1,
    // marginTop: 15,
    marginLeft: 5,
  },
  // Styles used in Chat.js:
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  commonContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  commonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  clientProfileName: {
    justifyContent: 'center',
    marginLeft: 90,
    marginTop: 30,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold'
  },
  clientProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 10,
  },
  commonView: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    borderColor: 'black',
    borderStyle: 'solid'
  },
  clientNameText: {
    fontWeight: '600',
    fontSize: 18
  },
  clientGenderText: {
    fontStyle: 'italic'
  },
  clientPicker: {
    width: 100,
  },
  clientButton: {
    height: 28,
    width: 28,
    resizeMode: 'contain'
  },
  clientGalleryContainer: {
    flex: 1,
    paddingBottom: 50,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
  },
  clientGalleryProfileImage: {
    marginLeft: 25,
    marginTop: 8,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#006400',
  },
  clientGalleryProfileNameText: {
    marginLeft: 20,
    marginTop: 28,
    fontSize: 18,
    fontWeight: 'bold'
  },
  notificationText: {
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  notificationView: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'red',
    top: 0,
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  galleryRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  galleryText: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    borderColor: 'black',
    borderStyle: 'solid'
  },
  adjacentRowHighlightedSeparator: {
    height: 4,
    backgroundColor: '#3B5998'
  },
  adjacentRowNotHighlightedSeparator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  },
  prabhaavButton: {
    backgroundColor: '#006400',
    borderColor: '#006400',
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  galleryListViewProfileImage: {
    marginLeft: 20,
    marginTop: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#006400',
  },
  galleryListViewProfileName: {
    marginLeft: 40,
    marginTop: 42,
    fontSize: 18,
    fontWeight: 'bold'
  },
  galleryListViewThumb: {
    width: 300,
    height: 330,
  },
  galleryListViewButton: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    // alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  galleryListViewButtonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  galleryListViewInnerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  flexRowMarginBottom10: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  addPhotosMessage: {
    justifyContent: 'center',
    marginTop:  150,
    flexDirection: 'row'
  },
  clientGalleryAddPhotosMessage: {
    justifyContent: 'center',
    marginTop: 150,
    marginLeft: 60,
  },
  flexRow: {
    flexDirection: 'row'
  },
  heavyFont: {
    fontWeight: '600',
    fontSize: 18,
  },
  italicFont: {
    fontStyle: 'italic'
  },
  networkImageBase: {
    width: 300,
    height: 330,
  },
  networkImageProgress: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    width: 100,
    marginLeft: 130,
  },
  photoWrapper: {
    flex: 1,
    marginTop: STATUSBAR_HEIGHT
  },
  photoRow: {
    flexDirection: 'row',
    flex: 1,
  },
  flexContainer: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column'
  },
  picturePreview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shutterInnerViewStyle: {
    marginTop: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  shutterOuterViewStyle: {
    marginTop: 5,
    marginBottom: 70,
    marginRight: 35,
    marginLeft: 35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#006400',
    alignItems: 'center',
  },
  // modalButton is referenced in Start.js, but had no styling, keeping it for
  // the moment here.
  // TODO: talk to PBJ about this--I think it might be the global nature of CSS
  // where this was accessing a previously defined modalButton, but for whatever
  // reason it requires class styles to be defined
  modalButton: {
  },
  // ditto spinner in Photos.js
  spinner: {
  },
  // Twenty segment layout styles:
  //
  //  In this layout, the screen is divided into twenty equal-height horizontal
  //  segments.
  //
  //  The first segment is empty to allow the device status bar to be seen.
  //  For pages with keyboard input, the bottom eight segments are also empty
  //  to allow the keyboard to be seen and not to obscure any edit / text input
  //  areas.
  deviceStatusBarView: {
    flex: 1,
  },
  deviceKeyboardView: {
    flex: 8,
  },
  singleSegmentView: {
    flex: 1,
  },
  selectedImage: {
    flex: 9,
    margin: 1,
  },
  // Universal input styling
  //
  //  TODO: this probably needs to become a class since it's a view wrapping
  //        text input.
  //
  universalInputView: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  // Univeral font size
  //
  universalFontSize: {
    fontSize: 14
  },
  universalSwitchFontSize: {
    fontSize: 24
  },
  // Universal border styling
  //
  universalBorder: {
    borderColor: 'black',
    borderWidth: 1,
  },
  universalBorderRadius: {
    borderRadius: 10,
  },
  // Universal margin styling
  //
  universalMargin: {
    margin: 1,
  },
  // Universal button content alignment
  //
  universalButtonContentAlignment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Universal Button Text styling
  //
  universalButtonTextStyling: {
    fontSize: 14,
    color: 'white',
	alignSelf: 'center',
  },
  // Universal container (top-level)
  //
  universalContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  // Universal form containers
  //
  universalFormContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  //
  // Omits flex to permit inifinite size for scrolling:
  universalFormScrollingContainer: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  //
})
