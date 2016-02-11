'use strict';

import Color from './Color'

export function colorForState(state) {
  switch (state) {
    case 'waitingForReview':
    case 'prepareForUpload':
      return Color.AppStateYellow
      break
    case 'rejected':
      return Color.AppStateRed
      break
    default:
      return Color.AppStateGreen
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
