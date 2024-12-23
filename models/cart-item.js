const { DataTypes } = require('sequelize')

const sequelize = require('../util/mySqlDb')

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})

module.exports = CartItem
