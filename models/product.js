const fs = require('fs')
const path = require('path')
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
  constructor(title) {
    this.title = title
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(productFilePath, JSON.stringify(products), console.error)
    })
  }

  static fetchAll(callback) {
    getProductsFromFile(callback)
  }
}
