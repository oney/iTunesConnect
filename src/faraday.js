'use strict';

function dictionaryToQuery(opts) {
  return Object.keys(opts).map(function(i) {
    return encodeURIComponent(i) + '=' + encodeURIComponent(opts[i])
  }).join('&')
}

export default class Faraday {
  constructor() {
  }
  response(name, data) {

  }
  async send(method, path, params, headers) {
    switch (method) {
      case 'get':
        if (params) path = `${urlOrPath}?${dictionaryToQuery(params)}`
        return fetch(path, {
          method: 'GET',
          headers,
        })
        break
      case 'post':
        return fetch(path, {
          method: 'POST',
          headers,
          body: JSON.stringify(params)
        })
        break
      default:
        break
    }
  }
}
