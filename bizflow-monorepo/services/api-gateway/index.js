// นำเข้าเครื่องมือที่ติดตั้งไว้
require('dotenv').config({ path: '../../.env' }); // ให้อ่านไฟล์ .env จากโฟลเดอร์นอกสุด
const express = require('express');
const cors = require('cors');

// สร้าง Express App
const app = express();

// ตั้งค่า Middleware
app.use(cors()); // อนุญาตให้ Frontend ยิง API เข้ามาได้
app.use(express.json()); // ให้เซิร์ฟเวอร์อ่านข้อมูลแบบ JSON ได้

// สร้าง Route พื้นฐาน (เวลาเปิดเว็บหน้าแรกจะเจอข้อความนี้)
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: '🚀 BizFlow API Gateway is running smoothly!' 
    });
});

// สร้าง Route ตัวอย่างสำหรับระบบ POS
app.get('/api/menu', (req, res) => {
    // สมมติว่านี่คือข้อมูลที่ดึงมาจาก Database
    const sampleMenu = [
        { id: '1', name: 'ชาเฉาก๊วย', price: 45, emoji: '🧋' },
        { id: '2', name: 'ซาลาเปาไส้หมูสับ', price: 20, emoji: '🥟' }
    ];
    
    res.status(200).json({
        success: true,
        data: sampleMenu
    });
});

// ตั้งค่า Port และสั่งให้เซิร์ฟเวอร์เริ่มทำงาน
const PORT = process.env.API_PORT || 5000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🔗 Test the API at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});