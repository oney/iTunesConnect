'use strict';

module.exports = function(x) {
  if (typeof x !== 'string') return undefined
  try { return JSON.parse(x) }
  catch (e) { return undefined }
}
