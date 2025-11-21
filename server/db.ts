// server/db.ts

import mongoose from 'mongoose';
import { log } from "./app"; // 导入你 app.ts 文件中的 log 函数

// 从环境变量读取连接字符串。
// 我们之后会在 Vercel/部署平台设置这个变量。
const MONGO_URI = process.env.MONGO_URI; 

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  try {
    // 尝试连接 MongoDB 数据库
    await mongoose.connect(MONGO_URI);
    log("MongoDB connected successfully!", "Database");
  } catch (error) {
    log("MongoDB connection FAILED!", "Database");
    console.error(error);
    // 连接失败则退出应用
    process.exit(1); 
  }
}