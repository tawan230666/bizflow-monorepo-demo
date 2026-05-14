import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "default-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
  PROMPTPAY_ID: process.env.PROMPTPAY_ID || "0812345678",
};
