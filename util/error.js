exports.makeNewServerError = (error) => {
  const newError = new Error(error)
  newError.httpStatusCode = 500
  return newError
}
