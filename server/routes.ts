// server/routes.ts
import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactMessageSchema,
  type InsertContactMessage,
} from "@shared/schema";
import { sendContactMessage } from "./email";

function getClientIp(req: Request): string {
  return req.socket.remoteAddress || "unknown";
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const clientIp = getClientIp(req);

      // ✅ validatedData is now correctly typed
      const validatedData: InsertContactMessage =
        insertContactMessageSchema.parse(req.body);

      const isBanned = await storage.isIpBanned(clientIp);
      if (isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your IP address has been blocked from sending messages.",
        });
      }

      const savedMessage = await storage.createContactMessage(
        validatedData,
        clientIp
      );

      const emailSent = await sendContactMessage(
        validatedData.name,
        validatedData.email,
        validatedData.subject ?? null,
        validatedData.message
      );

      if (!emailSent) console.warn("Email sending failed, but message was saved");

      res.json({
        success: true,
        message: "Message sent successfully",
        id: savedMessage.id,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({
        success: false,
        message: "Failed to send message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // ...other routes unchanged...

  const httpServer = createServer(app);
  return httpServer;
}
