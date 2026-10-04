import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Durante o desenvolvimento, os pedidos a /api sao encaminhados
      // para a SIGECA API real (Node.js/Express em api.aeca.ao).
      '/api': {
        target: 'https://api.aeca.ao',
        changeOrigin: true,
        secure: true,
      },
      // Fotos de perfil, comprovativos, etc. — servidos estaticamente pela
      // API em /uploads (ver app.js: express.static(... 'uploads')).
      '/uploads': {
        target: 'https://api.aeca.ao',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
