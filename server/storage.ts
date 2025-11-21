import { type Article, type InsertArticle, type DictionaryWord, type InsertDictionaryWord } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  deleteArticle(id: string): Promise<boolean>;

  // Dictionary Words
  getDictionaryWords(): Promise<DictionaryWord[]>;
  getDictionaryWord(id: string): Promise<DictionaryWord | undefined>;
  createDictionaryWord(word: InsertDictionaryWord): Promise<DictionaryWord>;
  deleteDictionaryWord(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private articles: Map<string, Article>;
  private dictionaryWords: Map<string, DictionaryWord>;

  constructor() {
    this.articles = new Map();
    this.dictionaryWords = new Map();
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  async deleteArticle(id: string): Promise<boolean> {
    // Also delete associated dictionary words
    const wordsToDelete = Array.from(this.dictionaryWords.values())
      .filter(word => word.articleId === id);
    
    wordsToDelete.forEach(word => {
      this.dictionaryWords.delete(word.id);
    });

    return this.articles.delete(id);
  }

  // Dictionary Words
  async getDictionaryWords(): Promise<DictionaryWord[]> {
    return Array.from(this.dictionaryWords.values());
  }

  async getDictionaryWord(id: string): Promise<DictionaryWord | undefined> {
    return this.dictionaryWords.get(id);
  }

  async createDictionaryWord(insertWord: InsertDictionaryWord): Promise<DictionaryWord> {
    const id = randomUUID();
    const word: DictionaryWord = { ...insertWord, id };
    this.dictionaryWords.set(id, word);
    return word;
  }

  async deleteDictionaryWord(id: string): Promise<boolean> {
    return this.dictionaryWords.delete(id);
  }
}

export const storage = new MemStorage();
