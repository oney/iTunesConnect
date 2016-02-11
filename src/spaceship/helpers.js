'use strict';

import _ from 'lodash'

function collectDictionary(dictionary, callback) {
  let array = []
  Object.keys(dictionary).forEach(function (key) {
    array.push(callback(key, dictionary[key]))
  })
  return array
}

function dictionaryToQuery(opts) {
  return Object.keys(opts).map(function(i) {
    return encodeURIComponent(i) + '=' + encodeURIComponent(opts[i])
  }).join('&')
}

function selectDictionary(dictionary, callback) {
  let newDictionary = {}
  Object.keys(dictionary).forEach(function (key) {
    if (callback(key, dictionary[key])) {
      newDictionary[key] = dictionary[key]
    }
  })
  return newDictionary
}

module.exports = {
  collectDictionary,
  dictionaryToQuery,
  selectDictionary,
}
