import { StyleSheet, Dimensions } from 'react-native';

windowDimensions = Dimensions.get('window');

module.exports = StyleSheet.create({

  container: {
    flex: 1,
  },

  activityIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: windowDimensions.height / 8,
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: windowDimensions.height,
    width: windowDimensions.width,
  },

  cameraIco: {
    bottom: 20,
  },

  topIcons: {
    flexDirection: 'row',
    top: 10,
  },

  info: {
    flex: 1,
    left: 12,
    alignItems: 'flex-start',
  },

  gear: {
    flex: 1,
    right: 12,
    alignItems: 'flex-end',
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  langs: {
    height: windowDimensions.height / 1.20,
    width: windowDimensions.width / 1.14,
    paddingBottom: 10,
  },

  infoBox: {
    height: windowDimensions.height / 2.7,
    width: windowDimensions.width / 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  infoText: {
    fontSize: 25,
  },

  listBoxes: {
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    width: windowDimensions.width / 1.15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    fontSize: 24,
    paddingTop: 10,
    paddingBottom: 2,
  },

  Concept: {
    flex: 1,
    top: windowDimensions.height / 6,
    alignItems: 'center',
  },

  lnConceptText: {
    fontSize: 42,
    color: 'white',
  },

  enConceptText: {
    bottom: windowDimensions.height / 8,
    fontSize: 38,
    color: 'white',
  },
});
