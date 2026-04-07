const express = require("express")
const db      = require("../db/db")
const { protect, isAdmin } = require("../middleware/auth")

const router = express.Router()

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query
    let sql    = "SELECT * FROM products WHERE active = 1"
    const params = []
    if (category) { sql += " AND category = ?"; params.push(category) }
    if (search)   { sql += " AND name LIKE ?";  params.push(`%${search}%`) }
    const [rows] = await db.execute(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ? AND active = 1", [req.params.id])
    if (rows.length === 0) return res.status(404).json({ message: "Producto no encontrado" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/products (admin)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { name, price, category, description = "", stock = 0, image = "", rating = 0 } = req.body
    const [result] = await db.execute(
      "INSERT INTO products (name, price, category, description, stock, image, rating) VALUES (?,?,?,?,?,?,?)",
      [name, price, category, description, stock, image, rating]
    )
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/products/:id (admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { name, price, category, description, stock, image, rating } = req.body
    await db.execute(
      "UPDATE products SET name=?, price=?, category=?, description=?, stock=?, image=?, rating=? WHERE id=?",
      [name, price, category, description, stock, image, rating, req.params.id]
    )
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [req.params.id])
    res.json(rows[0])
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/products/:id (admin - soft delete)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await db.execute("UPDATE products SET active = 0 WHERE id = ?", [req.params.id])
    res.json({ message: "Producto eliminado" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
