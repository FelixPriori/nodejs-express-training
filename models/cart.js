const fs = require('fs')
const { cartFilePath } = require('../util/path')

const getCartFromFile = (callback) => {
  fs.readFile(cartFilePath, (err, fileContent) => {
    if (err) {
      callback([])
    } else {
      callback(JSON.parse(fileContent))
    }
  })
}

module.exports = class Cart {
  static addProduct(id, productPrice) {
    getCartFromFile((cart) => {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      )
      const existingProduct = cart.products[existingProductIndex]

      let updatedProduct
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +productPrice
      fs.writeFile(cartFilePath, JSON.stringify(cart), console.error)
    })
  }

  static deleteProduct(id, productPrice) {
    getCartFromFile((cart) => {
      const updatedCart = { ...cart }
      const product = updatedCart.products.find((product) => product.id === id)

      if (!product) {
        return
      }

      const productQty = product.qty
      updatedCart.totalPrice =
        +updatedCart.totalPrice - +productPrice * productQty
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      )

      fs.writeFile(cartFilePath, JSON.stringify(updatedCart), console.error)
    })
  }

  static getCart(callback) {
    getCartFromFile(callback)
  }
}
