const Product = require('../models/product')
const { productNotFound } = require('./error')

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch(console.error)
}

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'Shop',
        path: '/products',
      })
    })
    .catch(console.error)
}

exports.getProduct = (req, res, next) => {
  const { productId } = req.params
  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        productNotFound(res)
      }
      res.render('shop/product-details', {
        product,
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch(console.error)
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts()
    })
    .then((products) => {
      res.render('shop/cart', {
        products,
        pageTitle: 'Cart',
        path: '/cart',
      })
    })
    .catch(console.error)
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body
  let fetchedCart
  let newQuantity = 1
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then((products) => {
      let product
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
        return product
      }
      return Product.findByPk(productId)
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      })
    })
    .then(() => res.redirect('/cart'))
    .catch(console.error)
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } })
    })
    .then(([product]) => {
      if (!product) {
        productNotFound(res)
      }
      return product.cartItem.destroy()
    })
    .then(() => res.redirect('/cart'))
    .catch(console.error)
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        orders,
        pageTitle: 'Your Orders',
        path: '/orders',
      })
    })
    .catch(console.error)
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = {
                quantity: product.cartItem.quantity,
              }
              return product
            })
          )
        })
        .catch(console.error)
    })
    .then(() => {
      return fetchedCart.setProducts(null)
    })
    .then(() => res.redirect('/orders'))
    .catch(console.error)
}
