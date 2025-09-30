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
          const script = path.join(process.cwd(), 'scripts', 'generate-content.ts')
          exec(`npx tsx ${script}`, (error, stdout, stderr) => {
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
      },
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

