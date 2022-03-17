const mysql = require('mysql2')
require('dotenv').config()

// Database connection
// To connect to mysql run following query but
// 1) You have to disconnect all the databases currently ruuning.
// 2) Connect it without defining database variable.
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

connection.connect((err) => {
  if (err) {
    console.log(`Connection Failed ${err}`)
  } else {
    console.log(`Database Connected Successfully`)
  }
})
module.exports = connection
