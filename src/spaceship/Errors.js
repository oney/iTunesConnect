function UnauthorizedError(message) {
  this.name = 'UnauthorizedError'
  this.message = (message || '')
}
UnauthorizedError.prototype = Object.create(Error.prototype)

function InvalidUserCredentialsError(message) {
  this.name = 'InvalidUserCredentialsError'
  this.message = (message || '')
}
InvalidUserCredentialsError.prototype = Object.create(Error.prototype)

function NoUserCredentialsError(message) {
  this.name = 'NoUserCredentialsError'
  this.message = (message || '')
}
NoUserCredentialsError.prototype = Object.create(Error.prototype)

function UnexpectedResponse(message) {
  this.name = 'UnexpectedResponse'
  this.message = (message || '')
}
UnexpectedResponse.prototype = Object.create(Error.prototype)

export default {
  UnauthorizedError,
  InvalidUserCredentialsError,
  NoUserCredentialsError,
  UnexpectedResponse,
}
