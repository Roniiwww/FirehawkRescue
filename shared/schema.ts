// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

/** ---------- DRIZZLE TABLES (unchanged) ---------- */
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

/** ---------- ZOD SCHEMAS FOR API/BUSINESS LOGIC ---------- */
/* Use explicit zod objects instead of drizzle-zod picks,
   to avoid “true → never” inference issues. */

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional().nullable(),
  message: z.string().min(1),
});

export const insertBannedIpSchema = z.object({
  ipAddress: z.string().min(1),
  reason: z.string().optional().nullable(),
});

/** ---------- TYPES ---------- */
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertBannedIp = z.infer<typeof insertBannedIpSchema>;

/* Drizzle “select” types still work, if you need them */
export type User = typeof users.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type BannedIp = typeof bannedIps.$inferSelect;

