import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { exec } from 'child_process'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'regenerate-static-content-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/regenerate-static-content', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method not allowed')
            return
          }
          const gen = path.join(process.cwd(), 'scripts', 'generate-content.ts')
          const site = path.join(process.cwd(), 'scripts', 'generate-sitemap.ts')
          exec(`npx tsx ${gen} && npx tsx ${site}`, (error, stdout, stderr) => {
            if (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: error.message, stderr }))
              return
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, output: stdout }))
          })
        })

        server.middlewares.use('/api/migrate-testimonials', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method not allowed')
            return
          }
          
          res.setHeader('Content-Type', 'text/plain')
          res.setHeader('Transfer-Encoding', 'chunked')
          
          const migrationScript = path.join(process.cwd(), 'scripts', 'admin', 'migrate-testimonials-multilingual.ts')
          const child = exec(`npx tsx ${migrationScript}`)
          
          child.stdout?.on('data', (data) => {
            res.write(data)
          })
          
          child.stderr?.on('data', (data) => {
            res.write(data)
          })
          
          child.on('close', (code) => {
            if (code === 0) {
              res.end()
            } else {
              res.end(`\n❌ Migration failed with exit code ${code}`)
            }
          })
          
          child.on('error', (error) => {
            res.end(`\n❌ Migration error: ${error.message}`)
          })
        })

        // Contact form endpoint using MailerSend
        server.middlewares.use('/api/contact', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
            return
          }

          // Parse JSON body
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          
          req.on('end', async () => {
            try {
              const { name, email, type, message, phone } = JSON.parse(body)
          
              if (!name || !email || !message) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: 'Missing required fields' }))
                return
              }

              const apiKey = process.env.MAILERSEND_API_KEY
              const sender = process.env.MAILERSEND_SENDER || 'noreply@breathingflame.com'
              const receiver = process.env.CONTACT_RECEIVER || 'info@breathingflame.com'

              if (!apiKey) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: false, error: 'MailerSend API key not configured' }))
                return
              }

              const payload = {
                from: { email: sender, name: 'Breathing Flame Contact Form' },
                to: [{ email: receiver, name: 'Breathing Flame' }],
                subject: `New Contact Form Submission – ${type || 'General'}`,
                text: `Name: ${name}\nEmail: ${email}\nType: ${type}\n${phone ? `Phone: ${phone}\n` : ''}Message:\n${message}`,
                reply_to: { email, name }
              }

              const response = await fetch('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              })

              if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`MailerSend error ${response.status}: ${errorText}`)
              }

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true, message: 'Contact form submitted successfully' }))

            } catch (error) {
              console.error('Contact form error:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Failed to send email' }))
            }
          })
        })
      }
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
})

