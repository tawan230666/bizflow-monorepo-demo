import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,       // 👈 แก้เป็น 3000 ตามตัวหลังใน docker-compose
    strictPort: true, 
    host: '0.0.0.0'   
  }
})