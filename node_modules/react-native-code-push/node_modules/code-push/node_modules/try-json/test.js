'use strict';

var assert = require('assert')
  , ase = assert.strictEqual
  , ade = assert.deepEqual

describe('try-json', function() {
  var tryJSON = require('./index')
  
  it('valid object', function() {
    ade(tryJSON('{"ab": 2}'), {ab: 2})
  })

  it('valid array', function() {
    ade(tryJSON('[1,2,3,4]'), [1, 2, 3, 4])
  })

  it('valid null', function() {
    ade(tryJSON('null'), null)
  })

  it('invalid string', function() {
    ade(tryJSON('woaaaaaa!'), undefined)
  })
})
