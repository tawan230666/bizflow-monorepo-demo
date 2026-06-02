# 1. สร้างและเข้าโฟลเดอร์หลัก
mkdir -p bizflow-monorepo && cd bizflow-monorepo

# 2. สร้างโครงสร้าง
mkdir -p apps packages services

cat << 'EOF' > pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
EOF

cat << 'EOF' > package.json
{
  "name": "bizflow-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "start": "docker-compose up -d"
  }
}
EOF

cat << 'EOF' > .env.example
POSTGRES_USER=bizflow_user
POSTGRES_PASSWORD=bizflow_password
POSTGRES_DB=bizflow_db
API_PORT=5000
EOF

cp .env.example .env

# 3. ไฟล์ Docker Compose
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: bizflow-db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    networks:
      - bizflow-network

  api-gateway:
    build: ./services/api-gateway
    ports:
      - "5000:5000"
    depends_on:
      - db
    networks:
      - bizflow-network

  admin-production-grade:
    build: ./apps/admin-production-grade
    ports:
      - "3001:3000"
    networks:
      - bizflow-network

  staff-app:
    build: ./apps/staff-app
    ports:
      - "3002:3000"
    networks:
      - bizflow-network

  customer-app:
    build: ./apps/customer-app
    ports:
      - "3003:3000"
    networks:
      - bizflow-network

networks:
  bizflow-network:
    driver: bridge
EOF

# 4. สร้าง Backend
mkdir -p services/api-gateway
cd services/api-gateway
cat << 'EOF' > package.json
{
  "name": "api-gateway",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": { "express": "^4.19.2" }
}
EOF

cat << 'EOF' > index.js
const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ message: 'BizFlow API Gateway is running!' }));
app.listen(5000, () => console.log('Server running on port 5000'));
EOF

cat << 'EOF' > Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
EOF
cd ../..

# 5. สร้าง Frontend
cd apps
npm create vite@latest admin-production-grade -- --template react-ts
npm create vite@latest staff-app -- --template react-ts
npm create vite@latest customer-app -- --template react-ts
npm create vite@latest dev-portal -- --template react-ts

for app in admin-production-grade staff-app customer-app dev-portal; do
cat << 'EOF' > $app/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EOF
done
cd ..

echo "✅ ติดตั้งโครงสร้างและเครื่องยนต์เสร็จสมบูรณ์ 100%!"
