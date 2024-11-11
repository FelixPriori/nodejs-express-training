const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')
const User = require('../models/user')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const { createValidationObject } = require('../util/formValidation')

exports.getLogin = (req, res, next) => {
  const [errorMessage] = req.flash('error')
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage,
    formValues: {
      email: '',
      password: '',
    },
    validationErrors: {
      email: null,
      password: null,
    },
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  const [errorMessage] = req.flash('error')
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const validationErrors = createValidationObject(errors.array())
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage,
      formValues: {
        email,
        password,
      },
      validationErrors,
    })
  }

  User.findOne({ email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((error) => {
              if (error) {
                throw new Error(error)
              }
              res.redirect('/')
            })
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            formValues: {
              email,
              password,
            },
            validationErrors: {
              email: null,
              password: null,
            },
          })
        })
        .catch((error) => {
          console.error(error)
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Something went wrong',
            formValues: {
              email,
              password,
            },
            validationErrors: {
              email: null,
              password: null,
            },
          })
        })
    })
    .catch(console.error)
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error)
    }
    res.redirect('/login')
  })
}

exports.getSignup = (req, res, next) => {
  const [errorMessage] = req.flash('error')
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage,
    formValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: {
      name: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
  })
}

exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  const [errorMessage] = req.flash('error')
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const validationErrors = createValidationObject(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage,
      formValues: {
        name,
        email,
        password,
        confirmPassword,
      },
      validationErrors,
    })
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        cart: { items: [] },
      })
      return newUser.save()
    })
    .then(() => {
      res.redirect('/login')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      return sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: `Thank you ${name}!`,
        text: 'You sucessfully signed up for the NodeJs course shop!',
        html: '<h1>You sucessfully signed up for the NodeJs course shop!</h1>',
      })
    })
    .catch(console.error)
}

exports.getReset = (req, res, next) => {
  const [errorMessage] = req.flash('error')
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Your Password',
    errorMessage,
    formValues: {
      email: '',
    },
  })
}

exports.postReset = (req, res, next) => {
  const { email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Your Password',
      errorMessage: errors.array().map(({ msg }) => msg),
      formValues: {
        email,
      },
    })
  }

  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.error(error)
      req.flash('error', 'Something went wrong.')
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found.')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000 // 1h
        return user.save()
      })
      .then(() => {
        res.redirect('/email-sent')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        return sgMail.send({
          to: email,
          from: process.env.SENDGRID_FROM,
          subject: `Password Reset`,
          text: 'You sucessfully signed up for the NodeJs course shop!',
          html: `
              <h1>Reset your password!</h1>
              <p>Click <a href="http://localhost:3000/reset/${token}" target="_blank">this link</a> to set a new password.</p>
            `,
        })
      })
      .catch(console.error)
  })
}

exports.getEmailSent = (req, res, next) => {
  res.render('auth/email-sent', {
    path: '/email-sent',
    pageTitle: 'Email Sent',
  })
}

exports.getNewPassword = (req, res, next) => {
  const [errorMessage] = req.flash('error')
  const { resetToken } = req.params

  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        return res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'Update Password',
          errorMessage,
          userId: user._id.toString(),
          resetToken,
          formValues: {
            password: '',
            confirmPassword: '',
          },
        })
      }
      req.flash('error', 'Token expired. Try again.')
      return res.redirect('/reset')
    })
    .catch(console.error)
}

exports.postNewPassword = (req, res, next) => {
  const { password, userId, resetToken, confirmPassword } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Update Password',
      errorMessage: errors.array().map(({ msg }) => msg),
      userId,
      resetToken,
      formValues: {
        password,
        confirmPassword,
      },
    })
  }

  User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (user) {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            user.password = hashedPassword
            user.resetToken = null
            user.resetTokenExpiration = null
            return user.save()
          })
          .then(() => {
            res.redirect('/login')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            return sgMail.send({
              to: user.email,
              from: process.env.SENDGRID_FROM,
              subject: `Password Updated !`,
              text: 'You have sucessfully updated your password!',
              html: '<h1>You have sucessfully updated your password!</h1>',
            })
          })
          .catch(console.error)
      }
      req.flash('error', 'Token expired. Try again.')
      return res.redirect('/reset')
    })
    .catch(console.error)
}
