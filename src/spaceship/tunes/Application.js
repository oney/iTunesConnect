'use strict';

import TunesBase from './TunesBase'

export default class Application extends TunesBase {
  constructor() {
    super()
  }
  static async all() {
    return await this.client().applications()
  }
}
