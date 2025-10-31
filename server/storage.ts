import { type User, type InsertUser, type ContactMessage, type InsertContactMessage, type BannedIp, type InsertBannedIp } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage, ipAddress?: string): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: string): Promise<boolean>;
  banIp(ipAddress: string, reason?: string): Promise<BannedIp>;
  unbanIp(ipAddress: string): Promise<boolean>;
  getBannedIps(): Promise<BannedIp[]>;
  isIpBanned(ipAddress: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, ContactMessage>;
  private bannedIps: Map<string, BannedIp>;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.bannedIps = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage, ipAddress?: string): Promise<ContactMessage> {
    const id = randomUUID();
    const createdAt = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt,
      subject: insertMessage.subject || null,
      ipAddress: ipAddress || null
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  async banIp(ipAddress: string, reason?: string): Promise<BannedIp> {
    const id = randomUUID();
    const bannedAt = new Date();
    const bannedIp: BannedIp = {
      id,
      ipAddress,
      reason: reason || null,
      bannedAt
    };
    this.bannedIps.set(ipAddress, bannedIp);
    return bannedIp;
  }

  async unbanIp(ipAddress: string): Promise<boolean> {
    return this.bannedIps.delete(ipAddress);
  }

  async getBannedIps(): Promise<BannedIp[]> {
    return Array.from(this.bannedIps.values()).sort(
      (a, b) => b.bannedAt.getTime() - a.bannedAt.getTime()
    );
  }

  async isIpBanned(ipAddress: string): Promise<boolean> {
    return this.bannedIps.has(ipAddress);
  }
}

export const storage = new MemStorage();
