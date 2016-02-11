'use strict';

import Tunes from './'

export default class TunesBase {
  constructor() {
  }
  static client() {
    return this.clientVar || Tunes.client
  }
}
