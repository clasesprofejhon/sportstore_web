const express = require("express")
const db      = require("../db/db")
const { protect, isAdmin } = require("../middleware/auth")
const { sendOrderConfirmationEmail, sendReturnConfirmationEmail } = require("../services/emailService")

const router = express.Router()

// POST /api/orders — crear orden
router.post("/", protect, async (req, res) => {
  const { items, total } = req.body
  if (!items?.length) return res.status(400).json({ message: "El carrito está vacío" })

  // Validación numérica del total para evitar inserts inválidos
  const totalNum = Number(total)
  if (!Number.isFinite(totalNum) || totalNum < 0) {
    return res.status(400).json({ message: "Total inválido" })
  }

  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    const [orderResult] = await conn.execute(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, "confirmed")',
      [req.user.id, totalNum]
    )
    const orderId = orderResult.insertId

    for (const item of items) {
      const qty   = Number(item.qty)
      const price = Number(item.price)
      if (!item.name || !Number.isFinite(qty) || qty < 1 || !Number.isFinite(price) || price < 0) {
        throw new Error("Item de pedido inválido")
      }
      // product puede venir como _id (Mongo-style) o product (id MySQL)
      const productId = Number(item.product ?? item._id)
      await conn.execute(
        "INSERT INTO order_items (order_id, product_id, name, qty, price) VALUES (?, ?, ?, ?, ?)",
        [orderId, Number.isFinite(productId) ? productId : null, item.name, qty, price]
      )
    }

    await conn.commit()

    const order = { _id: orderId, id: orderId, items, total: totalNum, status: "confirmed" }
    sendOrderConfirmationEmail(req.user, order).catch(console.error)
    res.status(201).json(order)
  } catch (err) {
    try { await conn.rollback() } catch (_) {}
    console.error("Error creando pedido:", err)
    res.status(500).json({ message: err.message || "Error al registrar el pedido" })
  } finally {
    conn.release()
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
      order.items     = items
      order._id       = order.id
      order.createdAt = order.created_at
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
      order.items     = items
      order._id       = order.id
      order.createdAt = order.created_at
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
