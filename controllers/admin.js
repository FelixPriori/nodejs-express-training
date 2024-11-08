const { productNotFound } = require('./error')
const Product = require('../models/product')

exports.getAddProducts = (req, res, next) => {
  const editMode = req.query.edit

  if (editMode) {
    return res.redirect('/admin/products')
  }

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: editMode,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, description, price } = req.body
  const imageUrl =
    'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
  // const imageUrl = req.body.imageUrl

  /* WITH MONGOOSE */
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  })
  product
    .save()
    .then(() => {
      return res.redirect('/admin/products')
    })
    .catch(console.error)

  /* WITH MONGODB */
  // const product = new Product(
  //   title,
  //   price,
  //   description,
  //   imageUrl,
  //   null,
  //   req.user._id
  // )
  // product
  //   .save()
  //   .then(() => {
  //     return res.redirect('/admin/products')
  //   })
  //   .catch(console.error)

  /* WITHOUT SEQUELIZE */
  // const product = new Product(null, title, imageUrl, description, price)
  // product
  //   .save()
  //   .then(() => {
  //     return res.redirect('/admin/products')
  //   })
  //   .catch(console.error)
  /* WITH SEQUELIZE */
  // req.user
  //   .createProduct({
  //     title,
  //     price,
  //     description,
  //     imageUrl,
  //     userId: req.user.id,
  //   })
  //   .then((result) => {
  //     return res.redirect('/admin/products')
  //   })
  //   .catch(console.error)
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) {
    return res.redirect('/admin/products')
  }

  const { productId } = req.params

  /* WITH MONGODB */
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        productNotFound(res)
      }

      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/products',
        editing: editMode,
      })
    })
    .catch(console.error)

  /* WITH SEQUELIZE */
  // req.user
  //   .getProducts({ where: { id: productId } })
  //   .then(([product]) => {
  //     if (!product) {
  //       productNotFound(res)
  //     }

  //     res.render('admin/edit-product', {
  //       product,
  //       pageTitle: 'Edit Product',
  //       path: '/admin/products',
  //       editing: editMode,
  //     })
  //   })
  //   .catch(console.error)
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, description, price } = req.body
  const imageUrl =
    'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'

  /* WITH MONGOOSE */
  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save().then(() => res.redirect('/admin/products'))
    })
    .catch(console.error)

  /* WITH MONGODB */
  // const product = new Product(title, price, description, imageUrl, productId)
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect('/admin/products')
  //   })
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // const { productId } = req.body
  // req.user
  //   .getProducts({ where: { id: productId } })
  //   .then(([product]) => {
  //     const { productId, title, description, price } = req.body
  //     const imageUrl =
  //       'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
  //     product.title = title
  //     product.description = description
  //     product.imageUrl = imageUrl
  //     product.price = price
  //     return product.save()
  //   })
  //   .then(() => {
  //     res.redirect('/admin/products')
  //   })
  //   .catch(console.error)
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body

  /* WITH MONGOOSE */
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(console.error)

  /* WITH MONGODB */
  // Product.deleteById(productId)
  //   .then(() => {
  //     res.redirect('/admin/products')
  //   })
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // req.user
  //   .getProducts({ where: { id: productId } })
  //   .then(([product]) => {
  //     return product.destroy()
  //   })
  //   .then(() => {
  //     res.redirect('/admin/products')
  //   })
  //   .catch(console.error)
}

exports.getAdminProducts = (req, res, next) => {
  /* WITH MONGOOSE */
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Products',
        path: '/admin/products',
      })
    })
    .catch(console.error)

  /* WITH MONGODB */
  // Product.fetchAll()
  //   .then((products) => {
  //     res.render('admin/products', {
  //       products,
  //       pageTitle: 'Products',
  //       path: '/admin/products',
  //     })
  //   })
  //   .catch(console.error)

  /* WITH SEQUELIZE */
  // req.user
  //   .getProducts()
  //   .then((products) => {
  //     res.render('admin/products', {
  //       products,
  //       pageTitle: 'Products',
  //       path: '/admin/products',
  //     })
  //   })
  //   .catch(console.error)
}
