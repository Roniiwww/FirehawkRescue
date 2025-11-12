import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bannedIps = pgTable("banned_ips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull().unique(),
  reason: text("reason"),
  bannedAt: timestamp("banned_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema<typeof users>(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema<typeof contactMessages>(
  contactMessages
).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertBannedIpSchema = createInsertSchema<typeof bannedIps>(bannedIps).pick({
  ipAddress: true,
  reason: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertBannedIp = z.infer<typeof insertBannedIpSchema>;
export type BannedIp = typeof bannedIps.$inferSelect;

