const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postLogin = (req, res, next) => {
  const userId = '672a37f0e2906079a18b4ee0'
  User.findById(userId)
    .then((user) => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save((error) => {
        if (error) {
          console.error(error)
        }
        res.redirect('/')
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
