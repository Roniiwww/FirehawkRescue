import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { sendContactMessage } from "./email";

// Helper function to get client IP address
// Uses the direct socket connection to prevent IP spoofing
function getClientIp(req: Request): string {
  return req.socket.remoteAddress || 'unknown';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      
      // Check if IP is banned
      const isBanned = await storage.isIpBanned(clientIp);
      if (isBanned) {
        return res.status(403).json({ 
          success: false, 
          message: 'Your IP address has been blocked from sending messages.' 
        });
      }
      
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Store the message with IP address
      const savedMessage = await storage.createContactMessage(validatedData, clientIp);
      
      // Send email notification
      const emailSent = await sendContactMessage(
        validatedData.name,
        validatedData.email,
        validatedData.subject || null,
        validatedData.message
      );
      
      if (!emailSent) {
        console.warn('Email sending failed, but message was saved');
      }
      
      res.json({ 
        success: true, 
        message: 'Message sent successfully',
        id: savedMessage.id 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get all contact messages (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch messages' 
      });
    }
  });

  // Delete a contact message
  app.delete("/api/contact/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteContactMessage(id);
      
      if (deleted) {
        res.json({ 
          success: true, 
          message: 'Message deleted successfully' 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'Message not found' 
        });
      }
    } catch (error) {
      console.error('Error deleting contact message:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete message' 
      });
    }
  });

  // Ban an IP address
  app.post("/api/ban-ip", async (req, res) => {
    try {
      const { ipAddress, reason } = req.body;
      
      if (!ipAddress) {
        return res.status(400).json({ 
          success: false, 
          message: 'IP address is required' 
        });
      }
      
      const bannedIp = await storage.banIp(ipAddress, reason);
      res.json({ 
        success: true, 
        message: 'IP address banned successfully',
        bannedIp 
      });
    } catch (error) {
      console.error('Error banning IP:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to ban IP address' 
      });
    }
  });

  // Unban an IP address
  app.delete("/api/ban-ip/:ipAddress", async (req, res) => {
    try {
      const { ipAddress } = req.params;
      const unbanned = await storage.unbanIp(decodeURIComponent(ipAddress));
      
      if (unbanned) {
        res.json({ 
          success: true, 
          message: 'IP address unbanned successfully' 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'IP address not found in ban list' 
        });
      }
    } catch (error) {
      console.error('Error unbanning IP:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to unban IP address' 
      });
    }
  });

  // Get all banned IPs
  app.get("/api/banned-ips", async (req, res) => {
    try {
      const bannedIps = await storage.getBannedIps();
      res.json(bannedIps);
    } catch (error) {
      console.error('Error fetching banned IPs:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch banned IPs' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
