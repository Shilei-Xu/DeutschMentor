import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Articles table for German learning content
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Dictionary words saved from articles
export const dictionaryWords = pgTable("dictionary_words", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  context: text("context").notNull(), // The sentence/phrase where the word appears
  articleId: varchar("article_id").notNull(),
});

export const insertDictionaryWordSchema = createInsertSchema(dictionaryWords).omit({
  id: true,
});

export type InsertDictionaryWord = z.infer<typeof insertDictionaryWordSchema>;
export type DictionaryWord = typeof dictionaryWords.$inferSelect;
