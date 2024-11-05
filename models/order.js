/* WITH SEQUELIZE */
// const { DataTypes } = require('sequelize')

// const sequelize = require('../util/mySqlDb')

// const Order = sequelize.define('order', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
// })

// module.exports = Order

const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
  products: [
    {
      productData: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
})

module.exports = model('Order', orderSchema)
