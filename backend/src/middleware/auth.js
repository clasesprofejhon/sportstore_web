const jwt = require("jsonwebtoken")
const db  = require("../db/db")

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).json({ message: "No autenticado" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    const [rows] = await db.execute(
      "SELECT id, name, email, credit_card, role, verified, created_at FROM users WHERE id = ?",
      [decoded.id]
    )
    if (rows.length === 0) return res.status(401).json({ message: "Usuario no encontrado" })
    req.user = rows[0]
    next()
  } catch {
    res.status(401).json({ message: "Token inválido" })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Acceso denegado" })
  next()
}

module.exports = { protect, isAdmin }
