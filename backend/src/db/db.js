const mysql = require("mysql2")

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "tienda_deportiva",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

pool.getConnection((err, conn) => {
  if (err) {
    console.error("Error conectando a MySQL:", err.message)
  } else {
    console.log(`Conectado a MySQL (${process.env.DB_HOST || "localhost"})`)
    conn.release()
  }
})

module.exports = pool.promise()
