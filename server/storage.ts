// server/storage.ts
import { v4 as uuidv4 } from "uuid";
import type {
  InsertUser,
  InsertContactMessage,
  User,
  ContactMessage,
  BannedIp,
  InsertBannedIp,
} from "@shared/schema";

export const storage = {
  // Example in-memory or DB-backed helpers (adapt to your real DB)

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = uuidv4();
    // Build a full compatible object, then cast to your select type (or insert into DB and return row)
    const user: Omit<User, "id"> & { id: string } = {
      id,
      username: insertUser.username,
      password: insertUser.password,
    };
    return user as User;
  },

  async createContactMessage(
    insertMessage: InsertContactMessage,
    ipAddress: string
  ): Promise<ContactMessage> {
    const id = uuidv4();
    const createdAt = new Date();
    const message: Omit<ContactMessage, "id" | "createdAt" | "ipAddress"> & {
      id: string;
      createdAt: Date;
      ipAddress: string;
    } = {
      id,
      name: insertMessage.name,
      email: insertMessage.email,
      subject: insertMessage.subject ?? null,
      message: insertMessage.message,
      ipAddress,
      createdAt,
    };
    return message as ContactMessage;
  },

  async isIpBanned(_ip: string): Promise<boolean> {
    // implement with DB; return false for now
    return false;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    return [];
  },

  async deleteContactMessage(_id: string): Promise<boolean> {
    return true;
  },

  async banIp(ipAddress: string, reason?: string | null): Promise<BannedIp> {
    const id = uuidv4();
    const bannedAt = new Date();
    const row: BannedIp = {
      id,
      ipAddress,
      reason: reason ?? null,
      bannedAt,
    } as BannedIp;
    return row;
  },

  async unbanIp(_ip: string): Promise<boolean> {
    return true;
  },

  async getBannedIps(): Promise<BannedIp[]> {
    return [];
  },
};
