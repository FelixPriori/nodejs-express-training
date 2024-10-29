const path = require('path')

const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

router.get('/add-product', adminController.getAddProducts)
router.post('/add-product', adminController.postAddProduct)

router.get('/products', adminController.getAdminProducts)

router.get('/edit-product', adminController.getEditProduct)

module.exports = router
