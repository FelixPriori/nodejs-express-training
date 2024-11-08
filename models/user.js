/* WITH SEQUELIZE */
// const { DataTypes } = require('sequelize')

// const sequelize = require('../util/mySqlDb')

// const User = sequelize.define('user', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// })

// module.exports = User

/* WITH MONGODB */
// const { ObjectId } = require('mongodb')
// const { getDb } = require('../util/database')

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username
//     this.email = email
//     this.cart = cart
//     this._id = id ? new ObjectId(id) : null
//   }

//   save() {
//     const db = getDb()
//     return db
//       .collection('users')
//       .insertOne(this)
//       .then(console.log)
//       .catch(console.error)
//   }

//   addToCart(product) {
//     const db = getDb()
//     const updatedCartItems = [...this.cart.items]

//     const cartProductIndex = updatedCartItems.findIndex(
//       (cartProduct) =>
//         cartProduct.productId.toString() === product._id.toString()
//     )

//     let newQuantity = 1
//     if (cartProductIndex >= 0) {
//       newQuantity = updatedCartItems[cartProductIndex].quantity + 1
//       updatedCartItems[cartProductIndex].quantity = newQuantity
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       })
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     }

//     return db
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
//       .then(console.log)
//       .catch(console.error)
//   }

//   getCart() {
//     const db = getDb()
//     const productIds = this.cart.items.map((cartItem) => cartItem.productId)
//     return db
//       .collection('products')
//       .find({
//         _id: {
//           $in: productIds,
//         },
//       })
//       .toArray()
//       .then((products) => {
//         const cartProducts = products.map((product) => ({
//           ...product,
//           quantity: this.cart.items.find(
//             (productItem) =>
//               productItem.productId.toString() === product._id.toString()
//           ).quantity,
//         }))
//         console.log(cartProducts)
//         return cartProducts
//       })
//       .catch(console.error)
//   }

//   deleteItemFromCart(productId) {
//     const db = getDb()
//     const updatedCartItems = this.cart.items.filter(
//       (cartItem) => cartItem.productId.toString() !== productId.toString()
//     )

//     const updatedCart = {
//       items: updatedCartItems,
//     }

//     return db
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
//       .then(console.log)
//       .catch(console.error)
//   }

//   addOrder() {
//     const db = getDb()
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//           },
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then((result) => {
//         this.cart = { items: [] }
//         return db
//           .collection('users')
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
//       })
//       .catch(console.error)
//   }

//   getOrders() {
//     const db = getDb()
//     return db
//       .collection('orders')
//       .find({
//         'user._id': this._id,
//       })
//       .toArray()
//       .catch(console.error)
//   }

//   static findById(userId) {
//     const db = getDb()
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user)
//         return user
//       })
//       .catch(console.error)
//   }
// }

/* WITH MONGOOSE */
const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
    },
  },
  {
    methods: {
      addToCart(product) {
        const updatedCartItems = [...this.cart.items]

        const cartProductIndex = updatedCartItems.findIndex(
          (cartProduct) =>
            cartProduct.productId._id.toString() === product._id.toString()
        )

        let newQuantity = 1
        if (cartProductIndex >= 0) {
          newQuantity = updatedCartItems[cartProductIndex].quantity + 1
          updatedCartItems[cartProductIndex].quantity = newQuantity
        } else {
          updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
          })
        }

        const updatedCart = {
          items: updatedCartItems,
        }

        this.cart = updatedCart
        return this.save()
      },
      deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(
          (cartItem) =>
            cartItem.productId._id.toString() !== productId.toString()
        )

        const updatedCart = {
          items: updatedCartItems,
        }

        this.cart = updatedCart
        return this.save()
      },
      clearCart() {
        this.cart = {
          items: [],
        }
        return this.save()
      },
    },
  }
)

module.exports = model('User', userSchema)
