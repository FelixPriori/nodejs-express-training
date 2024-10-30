const Product = require('../models/product')
const Cart = require('../models/cart')
const { productNotFound } = require('./error')

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  Product.fetchById(req.params.productId, (product) => {
    if (!product) {
      productNotFound(res)
    }

    res.render('shop/product-details', {
      product,
      pageTitle: product.title,
      path: '/products',
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = []
      for (const product of products) {
        const cartProduct = cart.products.find((prod) => prod.id === product.id)
        if (!!cartProduct) {
          cartProducts.push({
            productData: product,
            qty: cartProduct.qty,
          })
        }
      }
      res.render('shop/cart', {
        products: cartProducts,
        pageTitle: 'Cart',
        path: '/cart',
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId
  console.log({ productId })
  Product.fetchById(productId, (product) => {
    if (!product) {
      productNotFound(res)
    }

    Cart.addProduct(productId, product.price)
    res.redirect('/cart')
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.fetchById(productId, (product) => {
    Cart.deleteProduct(productId, product.price)
    res.redirect('/cart')
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
