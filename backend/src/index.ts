import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { rateLimitMiddleware } from "./middleware/rateLimit";
import authRoutes from "./routes/auth";
import clientRoutes from "./routes/clients";
import campaignRoutes from "./routes/campaigns";
import generationRoutes from "./routes/generations";
import uploadRoutes from "./routes/uploads";
import { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use("/*", corsMiddleware);
app.use("/*", rateLimitMiddleware());

// Health check
app.get("/health", (c) => c.json({ 
  status: "ok",
  timestamp: new Date().toISOString(),
  version: "1.0.0",
}));

// API routes
app.route("/auth", authRoutes);
app.route("/clients", clientRoutes);
app.route("/campaigns", campaignRoutes);
app.route("/generations", generationRoutes);
app.route("/uploads", uploadRoutes);

// Dashboard stats endpoint
app.get("/dashboard/stats", async (c) => {
  const { authMiddleware } = await import("./middleware/auth");
  await authMiddleware(c, async () => {});
  
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const db = await import("./services/db");
  const clients = await db.getClientsByUserId(c.env, user.id, 1000, 0);
  
  const clientIds = clients.map(c => c.id);
  
  // Get all campaigns for these clients
  let campaigns: any[] = [];
  for (const clientId of clientIds) {
    const client = await db.getClientById(c.env, clientId);
    if (client?.campaigns) {
      campaigns.push(...client.campaigns);
    }
  }
  
  // Count active campaigns
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  
  // Count total generations
  let totalGenerations = 0;
  for (const campaign of campaigns) {
    if (campaign.generations) {
      totalGenerations += campaign.generations.length;
    }
  }
  
  // Count brand kits
  let totalBrandKits = 0;
  for (const client of clients) {
    totalBrandKits += client.brandKits?.length || 0;
  }
  
  return c.json({
    activeCampaigns,
    totalGenerations,
    totalClients: clients.length,
    totalBrandKits,
    recentActivity: [], // TODO: Add activity tracking
  });
});

// 404 handler
app.notFound((c) => c.json({ error: "Not found" }, 404));

// Error handler
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ 
    error: "Internal server error",
    message: err.message,
  }, 500);
});

export default app;
