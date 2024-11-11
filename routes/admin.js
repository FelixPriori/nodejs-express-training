const path = require('path')

const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

const isAuth = require('../middleware/is-auth')

const {
  createProductTitleChain,
  createProductPriceChain,
  createProductImageUrlChain,
  createProductDescriptionChain,
} = require('../util/formValidation')

router.get(
  '/add-product',
  isAuth,

  adminController.getAddProducts
)

router.post(
  '/add-product',
  isAuth,
  [
    createProductTitleChain(),
    createProductPriceChain(),
    createProductImageUrlChain(),
    createProductDescriptionChain(),
  ],
  adminController.postAddProduct
)

router.get('/products', isAuth, adminController.getAdminProducts)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post(
  '/edit-product',
  isAuth,
  [
    createProductTitleChain(),
    createProductPriceChain(),
    createProductImageUrlChain(),
    createProductDescriptionChain(),
  ],
  adminController.postEditProduct
)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router
