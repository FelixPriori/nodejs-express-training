const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

/* USING EJS */
const app = express()
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
const { mongoConnect } = require('./util/database')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

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

app.use((req, res, next) => {
  /* USING MONGODB */
  const userId = '6728e4e9215d9bba56c99554'
  User.findById(userId)
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next()
    })
    .catch(console.error)
  /* USING SEQUELIZE */
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user
  //     next()
  //   })
  //   .catch(console.error)
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
app.use(errorController.pageNotFound)

/* USING MONGODB */
mongoConnect(() => {
  app.listen(3000)
})
