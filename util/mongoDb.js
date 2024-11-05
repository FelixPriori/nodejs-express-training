const { MongoClient } = require('mongodb')

let _db

const mongoConnect = (callback) => {
  const uri = process.env.MONGO_URI
  const client = new MongoClient(uri)
  // const dbName = 'admin'
  client
    .connect()
    .then((client) => {
      console.log('You successfully connected to MongoDB!')
      _db = client.db()
      callback()
    })
    .catch(console.error)
}

const getDb = () => {
  if (_db) {
    return _db
  } else {
    throw new Error('No database found.')
  }
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
