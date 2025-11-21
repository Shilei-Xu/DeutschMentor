// server/routes/data.ts (使用 Mongoose 重写)

import { Router, type Request, type Response } from "express";
import EntryModel from "server/models/Entry.ts"; // <-- 导入模型

const dataRouter = Router();

dataRouter.post("/api/save-data", async (req: Request, res: Response) => {
  try {
    // 1. 获取请求体中的数据
    const { name, value } = req.body; 

    if (!name || !value) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // 2. 创建一个新的数据实例
    const newEntry = new EntryModel({ name, value });

    // 3. 将数据保存到 MongoDB
    await newEntry.save();

    // 4. 返回成功响应
    res.status(201).json({ 
        success: true, 
        message: "数据已成功保存到 MongoDB！",
        record: newEntry 
    });
  } catch (error) {
    console.error("MongoDB 保存数据时出错:", error);
    res.status(500).json({ success: false, message: "数据库操作失败。" });
  }
});

export default dataRouter;