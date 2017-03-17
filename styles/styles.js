'use strict'

import React, {Component} from 'react';
import {StyleSheet, Dimensions,} from 'react-native';

module.exports = StyleSheet.create({

  container: {
    flex: 1
  },

  activityIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: Dimensions.get('window').height / 8,
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },

  cameraIco: {
    bottom: 20
  },

  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    height: Dimensions.get('window').height - 100,
    width: Dimensions.get('window').width - 80,
    paddingBottom: 10,
  },

  infoBox: {
    height: Dimensions.get('window').height - 480,
    width: Dimensions.get('window').width - 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  infoText: {
    fontSize: 25
  },

  listBoxes: {
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    width: Dimensions.get('window').width - 90,
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
    top: Dimensions.get('window').height / 6,
    alignItems: 'center',
  },

  lnConceptText: {
    fontSize: 42,
    color: 'white',
  },

  enConceptText: {
    bottom: Dimensions.get('window').height / 8,
    fontSize: 38,
    color: 'white',
  },
});
