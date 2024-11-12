const Product = require('../models/product')
const Order = require('../models/order')
const { productNotFound } = require('./error')
const { makeNewServerError } = require('../util/error')

exports.getIndex = (req, res, next) => {
  /* WITH MONGOOSE */
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((error) => {
      const newError = makeNewServerError(error)
      return next(newError)
    })

  /* WITH MONGODB */
  // Product.fetchAll()
  //   .then((products) => {
  //     res.render('shop/product-list', {
  //       products,
  //       pageTitle: 'Shop',
  //       path: '/',
  //     })
  //   })
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // Product.findAll()
  //   .then((products) => {
  //     res.render('shop/product-list', {
  //       products,
  //       pageTitle: 'Shop',
  //       path: '/',
  //     })
  //   })
  //   .catch(console.error)
}

exports.getProducts = (req, res, next) => {
  /* WITH MONGOOSE */
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'Shop',
        path: '/products',
      })
    })
    .catch((error) => {
      const newError = makeNewServerError(error)
      return next(newError)
    })

  /* WITH MONGODB */
  // Product.fetchAll()
  //   .then((products) => {
  //     res.render('shop/product-list', {
  //       products,
  //       pageTitle: 'Shop',
  //       path: '/products',
  //     })
  //   })
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // Product.findAll()
  //   .then((products) => {
  //     res.render('shop/product-list', {
  //       products,
  //       pageTitle: 'Shop',
  //       path: '/products',
  //     })
  //   })
  //   .catch(console.error)
}

exports.getProduct = (req, res, next) => {
  const { productId } = req.params

  /* WITH MONGODB */
  Product.findById(productId)
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
    .catch((error) => {
      const newError = makeNewServerError(error)
      return next(newError)
    })

  /* WITH SEQUELIZE */
  // Product.findByPk(productId)
  //   .then((product) => {
  //     if (!product) {
  //       productNotFound(res)
  //     }
  //     res.render('shop/product-details', {
  //       product,
  //       pageTitle: product.title,
  //       path: '/products',
  //     })
  //   })
  //   .catch(console.error)
}

exports.getCart = (req, res, next) => {
  /* WITH MONGODB */
  const products = req.user.cart.items.map((product) => ({
    quantity: product.quantity,
    ...product.productId._doc,
  }))
  res.render('shop/cart', {
    products,
    pageTitle: 'Cart',
    path: '/cart',
  })

  /* WITH SEQUELIZE */
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts()
  //   })
  //   .then((products) => {
  //     res.render('shop/cart', {
  //       products,
  //       pageTitle: 'Cart',
  //       path: '/cart',
  //     })
  //   })
  //   .catch(console.error)
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body
  let fetchedCart
  let newQuantity = 1

  /* USING MONGODB */
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product)
    })
    .then(() => res.redirect('/cart'))
    .catch((error) => {
      const newError = makeNewServerError(error)
      return next(newError)
    })

  /* USING SEQUELIZE */
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart
  //     return cart.getProducts({ where: { id: productId } })
  //   })
  //   .then((products) => {
  //     let product
  //     if (products.length > 0) {
  //       product = products[0]
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity
  //       newQuantity = oldQuantity + 1
  //       return product
  //     }
  //     return Product.findByPk(productId)
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     })
  //   })
  //   .then(() => res.redirect('/cart'))
  //   .catch(console.error)
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body

  /* WITH MONGODB */
  req.user
    .deleteItemFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch((error) => {
      const newError = makeNewServerError(error)
      return next(newError)
    })

  /* WITH SEQUELIZE */
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts({ where: { id: productId } })
  //   })
  //   .then(([product]) => {
  //     if (!product) {
  //       productNotFound(res)
  //     }
  //     return product.cartItem.destroy()
  //   })
  //   .then(() => res.redirect('/cart'))
  //   .catch(console.error)
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getOrders = (req, res, next) => {
  /* WITH MONGOOSE */
  Order.find({ 'user.userId': req.user._id }).then((orders) => {
    res.render('shop/orders', {
      orders,
      pageTitle: 'Your Orders',
      path: '/orders',
    })
  })

  /* WITH MONGODB */
  // req.user
  //   .getOrders()
  //   .then((orders) => {
  //     res.render('shop/orders', {
  //       orders,
  //       pageTitle: 'Your Orders',
  //       path: '/orders',
  //     })
  //   })
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // req.user
  //   .getOrders({ include: ['products'] })
  //   .then((orders) => {
  //     res.render('shop/orders', {
  //       orders,
  //       pageTitle: 'Your Orders',
  //       path: '/orders',
  //     })
  //   })
  //   .catch(console.error)
}

exports.postOrder = (req, res, next) => {
  /* WITH MONGOOSE */
  req.user
    .populate('cart.items.productId')
    .then((user) =>
      user.cart.items.map((product) => ({
        quantity: product.quantity,
        productData: { ...product.productId._doc },
      }))
    )
    .then((products) => {
      const order = new Order({
        products,
        user: {
          name: req.user.name,
          userId: req.user,
        },
      })
      return order.save()
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch((error) => {
      const newError = makeNewServerError(error)
      return next(newError)
    })

  /* WITH MONGODB */
  // req.user
  //   .addOrder()
  //   .then(() => res.redirect('/orders'))
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // let fetchedCart
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart
  //     return cart.getProducts()
  //   })
  //   .then((products) => {
  //     return req.user
  //       .createOrder()
  //       .then((order) => {
  //         return order.addProducts(
  //           products.map((product) => {
  //             product.orderItem = {
  //               quantity: product.cartItem.quantity,
  //             }
  //             return product
  //           })
  //         )
  //       })
  //       .catch(console.error)
  //   })
  //   .then(() => {
  //     return fetchedCart.setProducts(null)
  //   })
  //   .then(() => res.redirect('/orders'))
  //   .catch(console.error)
}
