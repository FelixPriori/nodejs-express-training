/* WITHOUT SEQUELIZE */
// const mysql = require('mysql2')

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   database: process.env.MYSQL_DB_NAME,
//   password: process.env.MYSQL_ROOT_PASSWORD,
// })

// module.exports = pool.promise()

/* WITH SEQUELIZE */
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_ROOT_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
)

module.exports = sequelize
