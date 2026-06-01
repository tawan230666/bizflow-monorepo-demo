import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // === Clean ===
  console.log("🧹 Cleaning old data...");
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE payments;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE order_items;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE orders;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE menu_options;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE menu_items;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE categories;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE tables;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE admins;");
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");

  // === Admins ===
  console.log("👤 Creating admin users...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const hashedKitchen = await bcrypt.hash("kitchen123", 10);
  const hashedCashier = await bcrypt.hash("cashier123", 10);

  await prisma.admin.createMany({
    data: [
      { username: "admin", password: hashedPassword, name: "ผู้จัดการร้าน", role: "admin" },
      { username: "kitchen", password: hashedKitchen, name: "ครัว", role: "kitchen" },
      { username: "cashier", password: hashedCashier, name: "แคชเชียร์", role: "cashier" },
    ],
  });

  // === Tables ===
  console.log("📍 Creating tables...");
  for (let i = 1; i <= 10; i++) {
    await prisma.table.create({
      data: {
        tableNumber: i,
        qrCode: `http://localhost:3000/table/${i}`,
        status: "available",
      },
    });
  }

  // === Categories ===
  console.log("📂 Creating categories...");
  const mainDish = await prisma.category.create({
    data: { name: "อาหารจานหลัก", sortOrder: 1 },
  });
  const drinks = await prisma.category.create({
    data: { name: "เครื่องดื่ม", sortOrder: 2 },
  });
  const desserts = await prisma.category.create({
    data: { name: "ของหวาน", sortOrder: 3 },
  });

  // === Menu Items ===
  console.log("🍜 Creating menu items...");

  const menus = [
    {
      categoryId: mainDish.id,
      name: "ผัดไทยกุ้งสด",
      description: "ผัดไทยสูตรต้นตำรับ กุ้งสด ๆ ตัวโต ราดน้ำมะขามรสกลมกล่อม",
      imageUrl: "https://images.unsplash.com/photo-1637806930600-37fa8892069d?w=500&q=80",
      price: 120,
      available: true,
      options: [
        { optionName: "ไม่เผ็ด", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดน้อย", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดปกติ", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดมาก", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เพิ่มไข่ดาว", optionType: "checkbox", groupName: "เพิ่มท็อปปิ้ง", extraPrice: 15 },
        { optionName: "เพิ่มกุ้ง", optionType: "checkbox", groupName: "เพิ่มท็อปปิ้ง", extraPrice: 30 },
      ],
    },
    {
      categoryId: mainDish.id,
      name: "ข้าวกะเพราหมูสับ",
      description: "ข้าวกะเพราหมูสับ ใส่พริกขี้หนูสด หอมกลิ่นกะเพรา เสิร์ฟพร้อมไข่ดาว",
      imageUrl: "https://images.unsplash.com/photo-1627308595186-e6bb36712645?w=500&q=80",
      price: 75,
      available: true,
      options: [
        { optionName: "เผ็ดน้อย", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดปกติ", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดมาก", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เพิ่มไข่ดาว", optionType: "checkbox", groupName: "เพิ่มเติม", extraPrice: 10 },
        { optionName: "เพิ่มข้าว", optionType: "checkbox", groupName: "เพิ่มเติม", extraPrice: 10 },
      ],
    },
    {
      categoryId: mainDish.id,
      name: "ต้มยำกุ้งน้ำข้น",
      description: "ต้มยำกุ้งสดน้ำข้น รสจัดจ้าน หอมสมุนไพรไทย",
      imageUrl: "https://images.unsplash.com/photo-1761037994516-502ed10932b0?w=500&q=80",
      price: 180,
      available: true,
      options: [
        { optionName: "เผ็ดน้อย", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดปกติ", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
        { optionName: "เผ็ดมาก", optionType: "radio", groupName: "ระดับความเผ็ด", extraPrice: 0 },
      ],
    },
    {
      categoryId: mainDish.id,
      name: "ส้มตำไทย",
      description: "ส้มตำไทยรสจัดจ้าน เปรี้ยวหวานเผ็ด ผักสดกรอบ",
      imageUrl: "https://images.unsplash.com/photo-1648421331147-9fcfab29536e?w=500&q=80",
      price: 60,
      available: true,
      options: [],
    },
    {
      categoryId: drinks.id,
      name: "ชาไทยเย็น",
      description: "ชาไทยสูตรเข้มข้น หวานมันลงตัว",
      imageUrl: "https://images.unsplash.com/photo-1644031995386-fe9665dc5b57?w=500&q=80",
      price: 45,
      available: true,
      options: [
        { optionName: "หวานน้อย", optionType: "radio", groupName: "ระดับความหวาน", extraPrice: 0 },
        { optionName: "หวานปกติ", optionType: "radio", groupName: "ระดับความหวาน", extraPrice: 0 },
        { optionName: "หวานมาก", optionType: "radio", groupName: "ระดับความหวาน", extraPrice: 0 },
        { optionName: "เพิ่มชีสโฟม", optionType: "checkbox", groupName: "ท็อปปิ้ง", extraPrice: 15 },
        { optionName: "เพิ่มไข่มุก", optionType: "checkbox", groupName: "ท็อปปิ้ง", extraPrice: 10 },
      ],
    },
    {
      categoryId: drinks.id,
      name: "น้ำมะนาวโซดา",
      description: "น้ำมะนาวสดผสมโซดา สดชื่นเย็นชื่นใจ",
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
      price: 50,
      available: true,
      options: [],
    },
    {
      categoryId: drinks.id,
      name: "กาแฟเย็น",
      description: "กาแฟสด คั่วเข้มข้น เสิร์ฟเย็น",
      imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80",
      price: 55,
      available: true,
      options: [],
    },
    {
      categoryId: desserts.id,
      name: "ข้าวเหนียวมะม่วง",
      description: "ข้าวเหนียวนึ่งหอมมัน คู่กับมะม่วงน้ำดอกไม้สุกหวาน ราดน้ำกะทิ",
      imageUrl: "https://images.unsplash.com/photo-1711161988375-da7eff032e45?w=500&q=80",
      price: 80,
      available: true,
      options: [],
    },
    {
      categoryId: desserts.id,
      name: "ลอดช่องน้ำกะทิ",
      description: "ลอดช่องใบเตยหนึบนุ่ม ในน้ำกะทิหอมหวาน เย็นชื่นใจ",
      imageUrl: "https://plus.unsplash.com/premium_photo-1723539626666-34de64a5b1a4?w=500&q=80",
      price: 55,
      available: true,
      options: [],
    },
    {
      categoryId: desserts.id,
      name: "ไอศกรีมกะทิ",
      description: "ไอศกรีมกะทิสด เสิร์ฟพร้อมท็อปปิ้งตามชอบ",
      imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80",
      price: 45,
      available: false,
      options: [],
    },
  ];

  for (const menu of menus) {
    const { options, ...data } = menu;
    await prisma.menuItem.create({
      data: {
        ...data,
        options: options.length > 0 ? { create: options as any } : undefined,
      },
    });
  }

  console.log("\n✅ Seed completed!");
  console.log(`   👤 Admins: ${await prisma.admin.count()}`);
  console.log(`   📍 Tables: ${await prisma.table.count()}`);
  console.log(`   📂 Categories: ${await prisma.category.count()}`);
  console.log(`   🍜 Menu items: ${await prisma.menuItem.count()}`);
  console.log(`   ⚙️  Menu options: ${await prisma.menuOption.count()}`);
  console.log("\n🔑 Login credentials:");
  console.log("   admin / admin123     (Full access)");
  console.log("   kitchen / kitchen123 (Kitchen display)");
  console.log("   cashier / cashier123 (Payment)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });