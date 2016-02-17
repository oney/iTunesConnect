'use strict';
import {
  Analytics,
  Hits as GAHits,
  Experiment as GAExperiment
} from 'react-native-google-analytics'
import DeviceInfo from 'react-native-device-info'
import {
  GA_ID,
} from '../utils/constants'

class GAManager {
  constructor() {
    if (__DEV__) {
      return
    }
    let clientId = DeviceInfo.getUniqueID()
    this.ga = new Analytics(GA_ID, clientId)
  }
  sendScreenView(name) {
    if (__DEV__) {
      return
    }
    const screenView = new GAHits.ScreenView('iTunesConnect', name, DeviceInfo.getVersion(), 'com.one.itunesconnect')
    this.ga.send(screenView)
  }
}
module.exports = new GAManager()
