const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')
const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  const [errorMessage] = req.flash('error')
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage,
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('login')
      }
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
          req.flash('error', 'Invalid email or password.')
          return res.redirect('/login')
        })
        .catch((error) => {
          console.error(error)
          res.redirect('/login')
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
  })
}

exports.postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/signup')
      }
      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.')
        return res.redirect('/signup')
      }
      return bcrypt
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
    })
    .catch(console.error)
}
