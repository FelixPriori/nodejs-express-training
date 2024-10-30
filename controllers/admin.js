const Product = require('../models/product')
const { productNotFound } = require('./error')

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
  const title = req.body.title
  const imageUrl =
    'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
  // const imageUrl = req.body.imageUrl
  const description = req.body.description
  const price = req.body.price
  const product = new Product(null, title, imageUrl, description, price)
  product
    .save()
    .then(() => {
      return res.redirect('/admin/products')
    })
    .catch(console.error)
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) {
    return res.redirect('/admin/products')
  }

  const productId = req.params.productId

  Product.fetchById(productId, (product) => {
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
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId
  const title = req.body.title
  const imageUrl =
    'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
  // const imageUrl = req.body.imageUrl
  const description = req.body.description
  const price = req.body.price

  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  )
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.productId)
  res.redirect('/admin/products')
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Products',
        path: '/admin/products',
      })
    })
    .catch(console.error)
}
