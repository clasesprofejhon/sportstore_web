const express = require("express")
const db      = require("../db/db")
const { protect, isAdmin } = require("../middleware/auth")
const { sendOrderConfirmationEmail, sendReturnConfirmationEmail } = require("../services/emailService")

const router = express.Router()

// POST /api/orders — crear orden
router.post("/", protect, async (req, res) => {
  try {
    const { items, total } = req.body
    if (!items?.length) return res.status(400).json({ message: "El carrito está vacío" })

    await db.execute("START TRANSACTION")
    try {
      const [orderResult] = await db.execute(
        'INSERT INTO orders (user_id, total, status) VALUES (?, ?, "confirmed")',
        [req.user.id, total]
      )
      const orderId = orderResult.insertId

      for (const item of items) {
        await db.execute(
          "INSERT INTO order_items (order_id, product_id, name, qty, price) VALUES (?, ?, ?, ?, ?)",
          [orderId, item.product || null, item.name, item.qty, item.price]
        )
      }

      await db.execute("COMMIT")

      const order = { _id: orderId, id: orderId, items, total, status: "confirmed" }
      sendOrderConfirmationEmail(req.user, order).catch(console.error)
      res.status(201).json(order)
    } catch (err) {
      await db.execute("ROLLBACK")
      throw err
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/my — pedidos del usuario autenticado
router.get("/my", protect, async (req, res) => {
  try {
    const [orders] = await db.execute(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    )
    for (const order of orders) {
      const [items] = await db.execute("SELECT * FROM order_items WHERE order_id = ?", [order.id])
      order.items = items
      order._id   = order.id
    }
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/orders/:id/return — solicitar devolución
router.post("/:id/return", protect, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    )
    if (rows.length === 0) return res.status(404).json({ message: "Pedido no encontrado" })
    const order = rows[0]
    if (order.status !== "delivered")
      return res.status(400).json({ message: "Solo se pueden devolver pedidos entregados" })

    await db.execute(
      'UPDATE orders SET status = "returned", return_reason = ?, returned_at = NOW() WHERE id = ?',
      [req.body.reason || "", req.params.id]
    )

    const updated = { ...order, _id: order.id, status: "returned", returnReason: req.body.reason }
    sendReturnConfirmationEmail(req.user, updated).catch(console.error)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders — todas las órdenes (admin)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)
    for (const order of orders) {
      const [items] = await db.execute("SELECT * FROM order_items WHERE order_id = ?", [order.id])
      order.items = items
    }
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/orders/:id/status (admin)
router.put("/:id/status", protect, isAdmin, async (req, res) => {
  try {
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id])
    const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [req.params.id])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
