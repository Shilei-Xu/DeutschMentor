import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertDictionaryWordSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Article routes
  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validated = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validated);
      res.status(201).json(article);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteArticle(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Dictionary routes
  app.get("/api/dictionary", async (_req, res) => {
    try {
      const words = await storage.getDictionaryWords();
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dictionary words" });
    }
  });

  app.get("/api/dictionary/:id", async (req, res) => {
    try {
      const word = await storage.getDictionaryWord(req.params.id);
      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch word" });
    }
  });

  app.post("/api/dictionary", async (req, res) => {
    try {
      const validated = insertDictionaryWordSchema.parse(req.body);
      const word = await storage.createDictionaryWord(validated);
      res.status(201).json(word);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid word data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to save word" });
    }
  });

  app.delete("/api/dictionary/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDictionaryWord(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Word not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete word" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
