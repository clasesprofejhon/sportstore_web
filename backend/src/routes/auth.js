const express = require("express")
const bcrypt  = require("bcryptjs")
const jwt     = require("jsonwebtoken")
const crypto  = require("crypto")
const db      = require("../db/db")
const { protect } = require("../middleware/auth")
const { sendVerificationEmail } = require("../services/emailService")

const router = express.Router()

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  })

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, card } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: "Todos los campos son requeridos" })

    // ── Validación de tarjeta ─────────────────────────────────────
    if (!card || !card.last4 || !card.holder || !card.expiry || !card.cvv)
      return res.status(400).json({ message: "Los datos de la tarjeta son requeridos" })

    const cvvLen = card.isAmex ? 4 : 3
    if (!/^\d+$/.test(card.cvv) || card.cvv.length !== cvvLen)
      return res.status(400).json({ message: `CVV inválido: debe tener ${cvvLen} dígitos` })

    const [mm, yy] = (card.expiry || "").split("/").map(Number)
    if (!mm || !yy || mm < 1 || mm > 12)
      return res.status(400).json({ message: "Fecha de vencimiento inválida" })
    const expDate = new Date(2000 + yy, mm - 1, 1)
    const today   = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    if (expDate < today)
      return res.status(400).json({ message: "La tarjeta está vencida" })
    // ─────────────────────────────────────────────────────────────

    const [exists] = await db.execute("SELECT id FROM users WHERE email = ?", [email])
    if (exists.length > 0)
      return res.status(400).json({ message: "El correo ya está registrado" })

    const hashedPassword    = await bcrypt.hash(password, 12)
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const creditCardLast4   = card?.last4 ? `****${card.last4}` : null

    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, credit_card, card_holder, card_expiry, verify_token)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, creditCardLast4, card?.holder || null, card?.expiry || null, verificationToken]
    )

    const user = { id: result.insertId, name, email, credit_card: creditCardLast4, role: "user" }
    sendVerificationEmail(user, verificationToken).catch(console.error)

    res.status(201).json({
      message: "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
      user
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/verify-email?token=...
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query
    const [rows] = await db.execute("SELECT id FROM users WHERE verify_token = ?", [token])
    if (rows.length === 0)
      return res.status(400).json({ message: "Token inválido o expirado" })

    await db.execute("UPDATE users SET verified = 1, verify_token = NULL WHERE id = ?", [rows[0].id])
    res.json({ message: "Email verificado exitosamente" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email])
    if (rows.length === 0)
      return res.status(401).json({ message: "Credenciales incorrectas" })

    const user  = rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(401).json({ message: "Credenciales incorrectas" })

    const { password: _, verify_token: __, ...safeUser } = user
    res.json({ token: signToken(user.id), user: safeUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/me
router.get("/me", protect, (req, res) => res.json(req.user))

module.exports = router
