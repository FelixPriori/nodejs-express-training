const mysql = require('mysql2')

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB_NAME,
  password: process.env.MYSQL_ROOT_PASSWORD,
})

module.exports = pool.promise()
