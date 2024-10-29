const Product = require('../models/product')

exports.getAddProducts = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl =
    'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png'
  // const imageUrl = req.body.imageUrl
  const description = req.body.description
  const price = req.body.price

  const product = new Product(title, imageUrl, description, price)
  product.save()
  res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    const product = products[1]
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
    })
  })
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products,
      pageTitle: 'Products',
      path: '/admin/products',
    })
  })
}
