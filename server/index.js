import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { handleAuthApi } from './authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Route all /api/auth requests to handleAuthApi
app.all('/api/auth/*', async (req, res) => {
  try {
    const result = await handleAuthApi(req.path, req.body)
    return res.status(result.status).json(result.data)
  } catch (err) {
    console.error('[API Error]:', err)
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`[HisaabKit Server] Auth & Nodemailer API running on http://localhost:${PORT}`)
})
