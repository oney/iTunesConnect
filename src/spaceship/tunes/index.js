'use strict';
import TunesClient from './TunesClient'
import Application from './Application'

export default class Tunes {
  constructor() {
  }
  static async login(user = null, password = null) {
    this.client = await TunesClient.login(user, password)
  }
  static Application = Application;
}
