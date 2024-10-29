const Product = require('../models/product')

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    res.render('shop/product-list', {
      products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getCart = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/cart', {
      products,
      pageTitle: 'Cart',
      path: '/cart',
    })
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  })
}

exports.getProductDetails = (req, res, next) => {
  Product.fetchAll((products) => {
    const product = products[1]
    res.render('shop/product-details', {
      product,
      pageTitle: 'Product Details',
      path: '/product-details',
    })
  })
}
