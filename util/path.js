const path = require('path')

const rootDir = path.dirname(require.main.filename)

exports.rootDir = rootDir

exports.productFilePath = path.join(rootDir, 'data', 'products.json')
exports.cartFilePath = path.join(rootDir, 'data', 'cart.json')
