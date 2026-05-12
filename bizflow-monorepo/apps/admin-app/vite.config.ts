import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,           // 1. เปลี่ยน Port เป็น 3001 ตามที่ต้องการ
    strictPort: true,     // 2. บังคับให้ใช้แค่ 3001 เท่านั้น (ถ้า port ชนให้แจ้ง Error ไม่แอบเปลี่ยนไป 3002)
    host: '127.0.0.1',    // 3. ป้องกันคนอื่นเข้าถึง: อนุญาตเฉพาะเครื่องนี้ (localhost) เครื่องอื่นใน LAN จะเข้าไม่ได้
  }
})