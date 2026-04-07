// ============================================================
// EMAIL SERVICE — EMULADO (sin SMTP externo)
// Los correos se imprimen en consola y se guardan en memoria.
// Accede al buzón en: GET /api/emails  (solo en desarrollo)
// ============================================================

const emailInbox = []   // Buzón en memoria

function logEmail(to, subject, body) {
  const email = {
    id:        emailInbox.length + 1,
    to,
    subject,
    body,
    sentAt:    new Date().toISOString()
  }
  emailInbox.push(email)

  // Imprimir en consola con formato claro
  console.log("\n" + "=".repeat(60))
  console.log("📧 EMAIL EMULADO")
  console.log(`   Para:    ${to}`)
  console.log(`   Asunto:  ${subject}`)
  console.log(`   Hora:    ${email.sentAt}`)
  console.log("-".repeat(60))
  console.log(body)
  console.log("=".repeat(60) + "\n")

  return email
}

// 1. Verificación de registro
async function sendVerificationEmail(user, token) {
  const url  = `http://localhost:3000/verify-email?token=${token}`
  const body = `Hola ${user.name},\n\nGracias por registrarte en SportStore.\n\nVerifica tu cuenta aquí:\n${url}\n\nSi no creaste esta cuenta, ignora este mensaje.`
  return logEmail(user.email, "✅ Confirma tu registro en SportStore", body)
}

// 2. Confirmación de compra
async function sendOrderConfirmationEmail(user, order) {
  const fmt   = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n)
  const items = order.items.map(i => `  - ${i.name} x${i.qty}  →  ${fmt(i.price * i.qty)}`).join("\n")
  const body  = `Hola ${user.name},\n\n¡Tu pedido fue confirmado!\n\nOrden #${order.id || order._id}\n\nProductos:\n${items}\n\nTotal: ${fmt(order.total)}\n\nTe avisaremos cuando sea enviado.`
  return logEmail(user.email, `🛒 Confirmación de pedido #${order.id || order._id}`, body)
}

// 3. Confirmación de devolución
async function sendReturnConfirmationEmail(user, order) {
  const body = `Hola ${user.name},\n\nRecibimos tu solicitud de devolución.\n\nOrden #${order.id || order._id}\nMotivo: ${order.returnReason || order.return_reason || "No especificado"}\n\nNuestro equipo te contactará en 2-3 días hábiles.`
  return logEmail(user.email, `🔄 Solicitud de devolución #${order.id || order._id}`, body)
}

// Exportar también el buzón para la ruta de debug
function getInbox() { return emailInbox }

module.exports = {
  sendVerificationEmail,
  sendOrderConfirmationEmail,
  sendReturnConfirmationEmail,
  getInbox
}
