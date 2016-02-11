'use strict';
const USER_AGENT = "Spaceship"

import {
  collectDictionary,
  dictionaryToQuery,
  selectDictionary,
} from './helpers'

import Faraday from '../faraday'
import Errors from './Errors'
import Logger from './Logger'

function checkUnauthorized(body) {
  return body.statusCode === 'ERROR' && body.messages && body.messages.error && body.messages.error.length > 0 && body.messages.error[0] === 'Unauthorized access'
}

export default class Client {
  static async login(user = null, password = null) {
    let instance = new this()
    if (await instance.login(user, password)) {
      return instance
    } else {
      throw new Errors.InvalidUserCredentialsError('Invalid User Credentials')
    }
  }
  constructor() {
    this.client = new Faraday("https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/")
    this.client.response('json', {content_type: /\bjson$/})
    this.client.response('xml', {content_type: /\bxml$/})
    this.client.response('plist', {content_type: /\bplist$/})
  }
  async login(user = null, password = null) {
    if (_.isEmpty(user.toString()) || _.isEmpty(password.toString())) {
      // NOTE: No need to implement CredentialsManager because there is no such thing
    }
    if (_.isEmpty(user.toString()) || _.isEmpty(password.toString())) {
      throw new Errors.NoUserCredentialsError('No login data provided')
    }
    this.user = user
    try {
      return await this.sendLoginRequest(user, password)
    } catch (e) {
      throw e
    }
  }
  storeCsrfTokens(response) {
    if (response && response.headers) {
      Logger.log('storeCsrfTokens map', response.headers.map);
      let token = selectDictionary(response.headers.map, function(k, v) {
        return ['csrf', 'csrf_ts'].includes(k)
      })
      Logger.log('storeCsrfTokens token', token);
      if (token && Object.keys(token).length !== 0) {
        this.csrfTokensVar = token
      }
    }
  }
  csrfTokens() {
    return this.csrfTokensVar || {}
  }
  async request(method, urlOrPath = null, params = null, headers = {}) {
    Object.assign(headers, this.csrfTokens())
    Object.assign(headers, { 'User-Agent': USER_AGENT })

    this.logRequest(method, urlOrPath, params)

    let response = await this.sendRequest(method, urlOrPath, params, headers)

    this.logResponse(method, urlOrPath, response)

    return response
  }
  logRequest(method, url, params) {
    let paramsToLog = Object.assign({}, params)
    delete paramsToLog.accountPassword
    delete paramsToLog.theAccountPW

    paramsToLog = collectDictionary(paramsToLog, function(key, value) {
      return `{${key}: ${value}}`
    })

    Logger.log(`${method.toUpperCase()}: ${url} ${paramsToLog.join(', ')}`)
  }
  async logResponse(method, url, response) {
    Logger.log(`${method.toUpperCase()}: ${url}: ${response}`)
  }
  async sendRequest(method, urlOrPath, params, headers) {
    // TODO: Not support with_retry and check 302 Found error
    let response = await this.client.send(method, urlOrPath, params, headers)
    return response
  }
  async parseResponse(response, expectedKey = null) {
    let body = await response.json()
    if (checkUnauthorized(body)) {
      throw new Errors.UnauthorizedError(body)
    }

    let content;
    if (body) {
      content = expectedKey ? body[expectedKey] : body
    }
    if (content === undefined) {
      throw new Errors.UnexpectedResponse(body)
    } else {
      this.storeCsrfTokens(response)
      return content
    }
  }
  encodeParams(params, headers) {
    params = dictionaryToQuery(params)
    headers = Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, headers)
    return [params, headers]
  }
}
