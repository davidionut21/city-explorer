import { pool } from './db.js'

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint()
  const metoda = req.method
  const cale = req.originalUrl

  res.on('finish', async () => {
    const durata = Number(
      process.hrtime.bigint() - inceput
    ) / 1e6

    try {
      await pool.query(
        `INSERT INTO jurnal
         (metoda, cale, status, durata_ms)
         VALUES (?, ?, ?, ?)`,
        [
          metoda,
          cale,
          res.statusCode,
          Math.round(durata),
        ]
      )
    } catch (error) {
      console.error(
        'Eroare la scrierea jurnalului:',
        error.message
      )
    }
  })

  next()
}