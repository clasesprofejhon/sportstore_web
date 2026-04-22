const mysql = require("mysql2")
require("dotenv").config()

const connection = mysql.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "tienda_deportiva"
})

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err)
  } else {
    console.log("Conectado a MySQL")
  }
})

module.exports = connection.promise()
