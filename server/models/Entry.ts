// server/models/Entry.ts

import mongoose, { Schema, Document } from 'mongoose';

// 接口定义了 TypeScript 中的类型
export interface IEntry extends Document {
  name: string;
  value: string;
  savedAt: Date;
}

// Schema 定义了 MongoDB 中的数据结构
const EntrySchema: Schema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
});

// 导出 Model，用于在路由中进行数据库操作
export default mongoose.model<IEntry>('Entry', EntrySchema);
