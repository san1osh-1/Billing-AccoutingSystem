import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'
import { handleAuthApi } from './server/authRoutes.js'

function authApiPlugin() {
  return {
    name: 'auth-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/auth')) {
          // Always reload .env so any changes to GMAIL_USER or credentials take effect immediately
          dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true })

          let body = {}
          if (req.method === 'POST' || req.method === 'PUT') {
            const buffers = []
            for await (const chunk of req) {
              buffers.push(chunk)
            }
            const data = Buffer.concat(buffers).toString()
            if (data) {
              try {
                body = JSON.parse(data)
              } catch (e) {
                body = {}
              }
            }
          }

          const pathname = req.url.split('?')[0]
          try {
            const result = await handleAuthApi(pathname, body)
            res.statusCode = result.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result.data))
            return
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), authApiPlugin()],
    server: { port: 5173, open: true },
  }
})