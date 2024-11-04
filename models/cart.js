const { DataTypes } = require('sequelize')

const sequelize = require('../util/mySqlDb')

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
})

module.exports = Cart
