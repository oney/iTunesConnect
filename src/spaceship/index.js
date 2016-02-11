'use strict';
/**
 * This package is Javascript version of Fastlane's Spaceship
 * https://github.com/fastlane/spaceship
 * Spaceship is a Ruby library that exposes both the Apple Developer Center and the iTunes Connect API
 * Currently, this package only implements part of iTunes Connect API
 */

import Tunes from './tunes'
import Errors from './Errors'

module.exports = {
  Tunes,
  Errors,
}
