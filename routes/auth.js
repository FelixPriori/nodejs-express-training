const path = require('path')
const express = require('express')

const authController = require('../controllers/auth')

const {
  createNameChain,
  createEmailChain,
  createPasswordChain,
  createConfirmPasswordChain,
  createAsyncUniqueEmailChain,
  createAsyncEmailExistsChain,
} = require('../util/formValidation')

const router = express.Router()

router.get('/login', authController.getLogin)

router.post(
  '/login',
  [createAsyncEmailExistsChain(), createPasswordChain()],
  authController.postLogin
)

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup)

router.post(
  '/signup',
  [
    createNameChain(),
    createAsyncUniqueEmailChain(),
    createPasswordChain(),
    createConfirmPasswordChain(),
  ],
  authController.postSignup
)

router.get('/reset', authController.getReset)

router.post('/reset', createAsyncEmailExistsChain(), authController.postReset)

router.get('/email-sent', authController.getEmailSent)

router.get('/reset/:resetToken', authController.getNewPassword)

router.post(
  '/new-password',
  [createPasswordChain(), createConfirmPasswordChain()],
  authController.postNewPassword
)

module.exports = router
