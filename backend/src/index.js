const express  = require("express")
const cors     = require("cors")
const morgan   = require("morgan")
const dotenv   = require("dotenv")
const initDB   = require("./db/initDB")

const authRoutes    = require("./routes/auth")
const productRoutes = require("./routes/products")
const orderRoutes   = require("./routes/orders")

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }))
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth",     authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders",   orderRoutes)

app.get("/api/health", (_, res) => res.json({ status: "ok", db: "tienda_deportiva", time: new Date() }))

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error("❌ Error al inicializar BD:", err.message)
    process.exit(1)
  })


// ── Buzón emulado — solo para desarrollo ──────────────────────
const { getInbox } = require("./services/emailService")

app.get("/api/emails", (req, res) => {
  const inbox = getInbox()
  res.json({
    total: inbox.length,
    emails: inbox.slice().reverse()   // más reciente primero
  })
})
