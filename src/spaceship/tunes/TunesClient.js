'use strict';
import Client from '../Client'
import Errors from '../Errors'
import Logger from '../Logger'
// import D from '../../data' // TEST: fake data

import _ from 'lodash'
const hostname = "https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/"

function fetchHash(hash, key, defaultValue) {
  return hash[key] || defaultValue
}

export default class TunesClient extends Client {
  constructor() {
    super()
  }
  async serviceKey() {
    if (this.serviceKeyVar) return this.serviceKeyVar
    let response = await this.request('get', 'https://itunesconnect.apple.com/itc/static-resources/controllers/login_cntrl.js')
    let body = await response.text()
    this.serviceKeyVar = body.match(/itcServiceKey = '(.*)'/)[1]
    return this.serviceKeyVar
  }
  async sendLoginRequest(user, password) {
    // return 200 // TEST: fake data
    let data = {
      accountName: user,
      password: password,
      rememberMe: true
    }
    let serviceKey = await this.serviceKey()
    Logger.log('serviceKey', serviceKey)
    let response = await this.request('post', `https://idmsa.apple.com/appleauth/auth/signin?widgetKey=${serviceKey}dd`, data, {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json, text/javascript',
    })
    await this.request('get', 'https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/wa/route?noext')
    await this.request('get', 'https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa')

    Logger.log('sendLoginRequest', response)
    switch (response.status) {
      case 403:
      case 401:
        throw new Error(`Invalid username and password combination. Used '${user}' as the username.`)
        break
      case 200:
        return response
        break
      default:
        if (response.headers.location && response.headers.location === '/auth') {
          throw new Error("spaceship / fastlane doesn't support 2 step enabled accounts yet. Please temporary disable 2 step verification until spaceship was updated.")
        } else if (((await response.text()) || '').indexOf('invalid="true"') > -1) {
          throw new Error(`Invalid username and password combination. Used '${user}' as the username.`)
        } else if ((response.headers.get('set-cookie') || '').indexOf('itctx') > -1) {
          throw new Error("Looks like your Apple ID is not enabled for iTunes Connect, make sure to be able to login online")
        } else {
          let info = [(await response.text), response.headers.get('set-cookie')]
          throw new Error(info.join('\n'))
        }
    }
  }
  async applications() {
    // return D.apps // TEST: fake data
    let r = await this.request('get', `${hostname}ra/apps/manageyourapps/summary/v2`)
    return (await this.parseResponse(r, 'data'))['summaries']
  }
  async appDetails(appId) {
    // return D.appDetail3 // TEST: fake data
    let r = await this.request('get', `${hostname}ra/apps/${appId}/details`)
    return await this.parseResponse(r, 'data')
  }
  async updateAppDetails(appId, data) {
    let r = await this.request('post', `${hostname}ra/apps/${appId}/details`, data, {
      'Content-Type': 'application/json'
    })
    return this.handleItcResponse(await r.json())
  }
  async appVersion(appId, isLive, versionNumber) {
    // return D.appVersion1 // TEST: fake data
    let r = await this.request('get', `${hostname}ra/apps/${appId}/overview`)
    let platforms = (await this.parseResponse(r, 'data'))['platforms']
    // let platforms = D.platforms1

    let platform = platforms.find(function(p) {
      return ['ios', 'osx', 'appletvos'].includes(p.platformString)
    })
    if (platform === undefined) {
      throw `Could not find platform ios, osx or appletvos for app ${appId}`
    }
    if (platforms.length > 1) {
      platform = platforms.find(function(p) {
        return p.platformString === 'ios'
      })
    }
    let version
    if (versionNumber) {
      if (platform.deliverableVersion && platform.deliverableVersion.version === versionNumber) {
        version = platform.deliverableVersion
      } else if (platform.inFlightVersion && platform.inFlightVersion.version === versionNumber) {
        version = platform.inFlightVersion
      }
    } else {
      version = platform[(isLive ? 'deliverableVersion' : 'inFlightVersion')]
    }
    if (!version) {
      return null
    }
    let versionId = version.id
    let versionPlatform = platform.platformString

    r = await this.request('get', `${hostname}ra/apps/${appId}/platforms/${versionPlatform}/versions/${versionId}`)
    return await this.parseResponse(r, 'data')
  }
  async candidateBuilds(appId, versionId) {
    // return D.candidateBuilds1 // TEST: fake data
    let r = await this.request('get', `${hostname}ra/apps/${appId}/versions/${versionId}/candidateBuilds`)
    return (await this.parseResponse(r, 'data'))['builds']
  }
  async updateAppVersion(appId, versionId, data) {
    let r = await this.request('post', `${hostname}ra/apps/${appId}/platforms/ios/versions/${versionId}`, data, {
      'Content-Type': 'application/json'
    })
    return this.handleItcResponse(await r.json())
  }
  async stateHistory(appId) {
    // return D.stateHistory1 // TEST: fake data
    let r = await this.request('get', `${hostname}ra/apps/${appId}/stateHistory`, {platform: 'ios'})
    return (await this.parseResponse(r, 'data'))['versions']
  }
  async stateHistoryWithVersion(appId, versionId) {
    // versionId = '1.1.0' // TEST: fake data
    let versions = await this.stateHistory(appId)
    let version = _.find(versions, function(v) {
      return v.versionString === versionId
    })
    return version
  }
  async logout() {
    this.user = null
    // return 200 // TEST: fake data
    let r = await this.request('get', `${hostname}wa/signOutCompleted`)
    return await r.text()
  }
  handleItcResponse(raw) {
    Logger.log('handleItcResponse raw', raw)
    if (!raw) return
    if (raw.constructor !== Object) return

    let data = raw.data || raw
    if (fetchHash(data, 'sectionErrorKeys', []).length === 0 && fetchHash(data, 'sectionInfoKeys', []).length === 0 && fetchHash(data, 'sectionWarningKeys', []).length === 0) {
      Logger.log('Request was successful')
    }
    function hasConstructor(value) {
      return value !== undefined && value !== null
    }

    function handleResponseHash(hash) {
      let errors = []
      if (!hasConstructor(hash)) {

      } else if (hash.constructor === Object) {
        Object.keys(hash).forEach(function (key) {
          let value = hash[key]
          errors = errors.concat(handleResponseHash(value))
          if (key === 'errorKeys' && hasConstructor(value) && value.constructor == Array && value.length > 0) {
            errors = errors.concat(value)
          }
        })
      } else if (hash.constructor == Array) {
        hash.forEach(function(value) {
          errors = errors.concat(handleResponseHash(value))
        })
      }
      return errors
    }
    let errors = handleResponseHash(data)
    // No need
    // if (data.sectionErrorKeys) {
    //   errors = errors.concat(data.sectionErrorKeys)
    // }
    let differentRrror = fetchHash(fetchHash(raw, 'messages', {}), 'error', null)
    if (differentRrror) {
      errors.push(differentRrror)
    }
    Logger.log('handleItcResponse errors', errors)
    if (errors.length > 0) {
      if (errors.length === 1 && (errors[0] === "You haven't made any changes." || errors[0] === 'operation_failed')) {

      } else {
        throw new Error(errors.join(' '))
      }
    }
    if (data.sectionInfoKeys) Logger.log(data.sectionInfoKeys)
    if (data.sectionWarningKeys) Logger.log(data.sectionWarningKeys)

    return data
  }
}
