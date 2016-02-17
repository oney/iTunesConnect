'use strict';

import React, {
  AsyncStorage,
} from 'react-native'
import Color from './Color'

import Spaceship, {
  Tunes,
} from '../spaceship'
const AppStatus = Tunes.AppStatus

export function colorForState(state) {
  switch (state) {
    case AppStatus.ReadyForSale:
      return Color.AppStateGreen
      break
    case AppStatus.Rejected:
    case AppStatus.DevRejected:
    case AppStatus.DeveloperRemovedFromSale:
    case AppStatus.MetadataRejected:
    case AppStatus.RemovedFromSale:
    case AppStatus.InvalidBinary:
      return Color.AppStateRed
      break
    default:
      return Color.AppStateYellow
  }
}
export function platformName(platformString) {
  switch (platformString) {
    case 'ios':
      return 'iOS'
      break
    case 'appletvos':
      return 'tvOS'
      break
    default:
      return 'Unknown'
  }
}
export function deviceCodeToName(device) {
  let v = {
    'iphone6': '4.7-Inch',
    'iphone6Plus': '5.5-Inch',
    'iphone4': '4-Inch',
    'iphone35': '3.5-Inch',
    'ipad': 'iPad',
    'ipadPro': 'iPad Pro',
    'watch': 'Watch',
  }[device]
  return v || 'Unknown'
}
export function deviceNameToCode(device) {
  let v = {
    '4.7-Inch': 'iphone6',
    '5.5-Inch': 'iphone6Plus',
    '4-Inch': 'iphone4',
    '3.5-Inch': 'iphone35',
    'iPad': 'ipad',
    'iPad Pro': 'ipadPro',
    'Watch': 'watch',
  }[device]
  return v || 'Unknown'
}
export async function AsyncStorageGetBooleanWithDefault(key, defaultValue) {
  const v = await AsyncStorage.getItem(key)
  return v === null ? defaultValue : v === 'true'
}
