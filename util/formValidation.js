const { body } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.createNameChain = () =>
  body('name')
    .isLength({ min: 1 })
    .withMessage('Please enter your name.')
    .trim()

const createEmailChain = () =>
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail()

exports.createEmailChain = createEmailChain

exports.createAsyncUniqueEmailChain = () =>
  createEmailChain().custom((email, { req }) => {
    return User.findOne({ email }).then((user) => {
      if (user) {
        return Promise.reject(
          'Email already exists. Please pick a different email.'
        )
      }
    })
  })

exports.createAsyncEmailExistsChain = () =>
  createEmailChain().custom((email, { req }) => {
    return User.findOne({ email }).then((user) => {
      if (!user) {
        return Promise.reject(
          'Email does not exist. Please enter an existing email.'
        )
      }
    })
  })

exports.createPasswordChain = () =>
  body('password', 'Your password should be at least 5 characters long.')
    .isLength({
      min: 5,
    })
    .trim()

exports.createConfirmPasswordChain = () =>
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!')
      }
      return true
    })

exports.createProductTitleChain = () =>
  body('title', 'You must enter a title for your product')
    .trim()
    .isLength({ min: 1 })

exports.createProductPriceChain = () =>
  body('price', 'You must enter a price for your product')
    .trim()
    .isFloat()
    .isLength({ min: 1 })

exports.createProductImageUrlChain = () =>
  body('imageUrl', 'You must enter an image for your product').isURL()

exports.createProductImageChain = () => body('image')

exports.createProductDescriptionChain = () =>
  body(
    'description',
    'You must enter a description between 5 and 400 characters for your product'
  )
    .trim()
    .isLength({ min: 5, max: 400 })

exports.createValidationObject = (errors) => {
  const validationObject = {}
  errors.forEach((error) => {
    validationObject[error.path] = error
  })
  return validationObject
}
