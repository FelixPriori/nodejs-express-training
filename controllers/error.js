exports.pageNotFound = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
  res.status(404).render('404', { pageTitle: 'Page Not Found!', path: null })
}

exports.productNotFound = (res) =>
  res.status(404).render('404', { pageTitle: 'Product Not Found!', path: null })
