const db = require("./db")

// Agrega una columna solo si no existe — compatible con tablas preexistentes
async function addColumnIfNotExists(table, column, definition) {
  const [rows] = await db.execute(`
    SELECT COUNT(*) AS cnt
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = ?
      AND COLUMN_NAME  = ?
  `, [table, column])

  if (rows[0].cnt === 0) {
    await db.execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
    console.log(`  ✔ Columna añadida: ${table}.${column}`)
  }
}

async function initDB() {

  // ── Tabla users ───────────────────────────────────────────────
  // Respeta la estructura existente (id, name, email, credit_card)
  // y añade las columnas de autenticación si faltan
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT(11)      NOT NULL AUTO_INCREMENT,
      name        VARCHAR(100) DEFAULT NULL,
      email       VARCHAR(100) DEFAULT NULL,
      credit_card VARCHAR(50)  DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  await addColumnIfNotExists("users", "password",     "VARCHAR(255) NOT NULL DEFAULT ''")
  await addColumnIfNotExists("users", "card_holder",  "VARCHAR(100) DEFAULT NULL")
  await addColumnIfNotExists("users", "card_expiry",  "VARCHAR(10)  DEFAULT NULL")
  await addColumnIfNotExists("users", "role",         "ENUM('user','admin') DEFAULT 'user'")
  await addColumnIfNotExists("users", "verified",     "TINYINT(1) DEFAULT 0")
  await addColumnIfNotExists("users", "verify_token", "VARCHAR(100) DEFAULT NULL")
  await addColumnIfNotExists("users", "created_at",   "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

  // Índice único en email si no existe
  const [idxRows] = await db.execute(`
    SELECT COUNT(*) AS cnt
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'users'
      AND INDEX_NAME   = 'unique_email'
  `)
  if (idxRows[0].cnt === 0) {
    await db.execute("ALTER TABLE `users` ADD UNIQUE KEY `unique_email` (`email`)")
    console.log("  ✔ Índice único añadido: users.email")
  }

  // ── Tabla products ────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id          INT(11)       NOT NULL AUTO_INCREMENT,
      name        VARCHAR(255)  NOT NULL,
      price       DECIMAL(12,2) NOT NULL,
      category    VARCHAR(100)  NOT NULL,
      description TEXT          DEFAULT NULL,
      stock       INT(11)       DEFAULT 0,
      image       VARCHAR(255)  DEFAULT '',
      rating      DECIMAL(3,1)  DEFAULT 0.0,
      active      TINYINT(1)    DEFAULT 1,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  // ── Tabla orders ──────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id            INT(11)       NOT NULL AUTO_INCREMENT,
      user_id       INT(11)       NOT NULL,
      total         DECIMAL(12,2) NOT NULL,
      status        ENUM('pending','confirmed','shipped','delivered','returned','cancelled') DEFAULT 'confirmed',
      return_reason TEXT          DEFAULT NULL,
      returned_at   TIMESTAMP     NULL DEFAULT NULL,
      created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  // ── Tabla order_items ─────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id          INT(11)       NOT NULL AUTO_INCREMENT,
      order_id    INT(11)       NOT NULL,
      product_id  INT(11)       DEFAULT NULL,
      name        VARCHAR(255)  NOT NULL,
      qty         INT(11)       NOT NULL,
      price       DECIMAL(12,2) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  // ── Seed productos demo ───────────────────────────────────────
  const [rows] = await db.execute("SELECT COUNT(*) AS cnt FROM products")
  if (rows[0].cnt === 0) {
    await db.execute(`
      INSERT INTO products (name, price, category, stock, image, rating) VALUES
      ('Camiseta Deportiva Pro', 49900,  'Fútbol',     15, '⚽', 4.8),
      ('Tenis de Running Air',   189900, 'Running',    8,  '👟', 4.9),
      ('Balón de Baloncesto',    79900,  'Baloncesto', 20, '🏀', 4.7),
      ('Gafas de Natación',      34900,  'Natación',   30, '🥽', 4.6),
      ('Shorts Deportivos',      29900,  'Running',    25, '🩳', 4.5),
      ('Guantes de Portero',     59900,  'Fútbol',     12, '🧤', 4.8)
    `)
    console.log("  ✔ Productos demo insertados")
  }

  console.log("✅ Base de datos lista — tienda_deportiva")
}

module.exports = initDB
