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
  buttonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  },

  // These next two styles go in Button.js which is used by Caption.js and
  // Selected.js
  button2: {
    height: 70,
    // backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button2Label: {
    color: 'white',
    fontSize: 20,
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
  captionGif: {
    width: 80,
    height: 80,
  },
  captionDefault: {
    height: 80,
    borderWidth: 1.5,
    borderColor: 'black',
    flex: 1,
    fontSize: 20,
    padding: 4,
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
    color: 'white',
    backgroundColor: 'red',
    fontWeight: 'bold',
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

  emailLoginContainer: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  emailLoginButtonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  emailLoginButton: {
    height: 36,
    backgroundColor: '#006400',
    borderColor: '#006400',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
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

  notificationView: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 25,
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

  selectedDefault: {
    height: 40,
    borderWidth: 2,
    borderColor: 'black',
    flex: 1,
    fontSize: 20,
    padding: 4,
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
  }

})
