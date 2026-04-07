const mysql = require("mysql2")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tienda_deportiva"
})

connection.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err)
  } else {
    console.log("Conectado a MySQL")
  }
})

// .promise() permite usar async/await en las rutas
module.exports = connection.promise()
