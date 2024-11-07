const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const { doubleCsrf: csrf } = require('csrf-csrf')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})

const csrfProtection = csrf({
  getSecret: () => process.env.CSRF_CSRF_SECRET,
  getTokenFromRequest: (req) => req.body._csrf,
  // __HOST and __SECURE are blocked in chrome, change name
  cookieName: '__APP-psfi.x-csrf-token',
})

/* USING EJS */
app.set('view engine', 'ejs')
app.set('views', 'views')

/* USING HANDLEBARS */
// const expressHandlebars = require('express-handlebars')
// const app = express()
// app.engine(
//   'handlebars',
//   expressHandlebars.engine({ defaultLayout: 'main-layout' })
// )
// app.set('view engine', 'handlebars')
// app.set('views', 'views')

/* USING PUG */
// const app = express()
// app.set('view engine', 'pug')
// app.set('views', 'views')

/* USING MONGODB */
// const { mongoConnect } = require('./util/database')
// const User = require('./models/user')

/* USING MONGOOSE */
const mongoose = require('mongoose')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const errorController = require('./controllers/error')

/* USING SEQUELIZE */
// const sequelize = require('./util/database')
// const Product = require('./models/product')
// const User = require('./models/user')
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrderItem = require('./models/order-item')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
)

app.use(cookieParser(process.env.CSRF_CSRF_SECRET))
app.use(csrfProtection.doubleCsrfProtection)
app.use(flash())

app.use((req, res, next) => {
  /* WITH MONGOOSE */
  if (req?.session?.user?._id) {
    User.findById(req.session.user._id)
      .populate('cart.items.productId')
      .then((user) => {
        req.user = user
        next()
      })
      .catch(console.error)
  } else {
    next()
  }

  /* USING MONGODB */
  // const userId = '6728e4e9215d9bba56c99554'
  // User.findById(userId)
  //   .then((user) => {
  //     req.user = new User(user.name, user.email, user.cart, user._id)
  //     next()
  //   })
  //   .catch(console.error)

  /* USING SEQUELIZE */
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user
  //     next()
  //   })
  //   .catch(console.error)
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

/* USING SEQUELIZE */
// Product.belongsTo(User, { contraints: true, onDelete: 'CASCADE' })
// User.hasMany(Product)
// User.hasOne(Cart)
// Cart.belongsTo(User)
// Cart.belongsToMany(Product, { through: CartItem })
// Product.belongsToMany(Cart, { through: CartItem })
// Order.belongsTo(User)
// User.hasMany(Order)
// Order.belongsToMany(Product, { through: OrderItem })
// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then(() => {
//     return User.findByPk(1)
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({
//         name: 'Felix',
//         email: 'test@example.com',
//       })
//     }
//     return Promise.resolve(user)
//   })
//   .then((user) => {
//     return user.createCart()
//   })
//   .then(app.listen(3000))
//   .catch(console.error)

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.pageNotFound)

/* USING MONGODB */
// mongoConnect(() => {
//   app.listen(3000)
// })

/* USING MONGOOSE */
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Felix',
    //       email: 'felix@example.com',
    //       cart: {
    //         items: [],
    //       },
    //     })
    //     user.save()
    //   }
    // })
    app.listen(3000)
  })
  .catch(console.error)
