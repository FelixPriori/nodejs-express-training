const fs = require('fs')
const Cart = require('./cart')
const { productFilePath } = require('../util/path')

const getProductsFromFile = (callback) => {
  fs.readFile(productFilePath, (err, fileContent) => {
    if (err) {
      callback([])
    } else {
      callback(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        )
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(
          productFilePath,
          JSON.stringify(updatedProducts),
          console.error
        )
      } else {
        this.id = Math.floor(Math.random() * 100000).toString()
        products.push(this)
        fs.writeFile(productFilePath, JSON.stringify(products), console.error)
      }
    })
  }

  static deleteById(productId) {
    getProductsFromFile((products) => {
      if (productId) {
        const product = products.find((prod) => prod.id === productId)
        const updatedProducts = products.filter((prod) => prod.id !== productId)
        fs.writeFile(
          productFilePath,
          JSON.stringify(updatedProducts),
          (err) => {
            if (!err) {
              Cart.deleteProduct(productId, product.price)
            } else {
              console.error(err)
            }
          }
        )
      }
    })
  }

  static fetchAll(callback) {
    getProductsFromFile(callback)
  }

  static fetchById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id)
      callback(product)
    })
  }
}
