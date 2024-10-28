const path = require('path')

const express = require('express')

const rootDir = require('../util/path')
const { products } = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
  // console.log(adminData.products)
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
  res.render('shop', {
    products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  })
})

module.exports = router
