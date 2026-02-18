import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env, User } from "../types";
import { authMiddleware } from "../middleware/auth";
import { 
  createCampaign,
  getCampaignsByUserId,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getClientById,
} from "../services/db";
import { v4 as uuidv4 } from "uuid";

const campaigns = new Hono<{ 
  Bindings: Env;
  Variables: { user: User };
}>();

campaigns.use("/*", authMiddleware);

// Validation schemas
const createCampaignSchema = z.object({
  clientId: z.string().uuid(),
  brandKitId: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  platforms: z.array(z.enum(["meta", "google", "tiktok", "linkedin"])),
  targetAudience: z.string().optional(),
  budget: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "completed"]).optional(),
  platforms: z.array(z.enum(["meta", "google", "tiktok", "linkedin"])).optional(),
  targetAudience: z.string().optional(),
  budget: z.number().positive().optional().or(z.literal(null)),
  startDate: z.string().datetime().optional().or(z.literal(null)),
  endDate: z.string().datetime().optional().or(z.literal(null)),
});

// GET /campaigns
campaigns.get("/", async (c) => {
  const user = c.get("user");
  const status = c.req.query("status");
  const search = c.req.query("search");
  
  const campaigns = await getCampaignsByUserId(c.env, user.id, { status, search });
  
  return c.json({ campaigns });
});

// GET /campaigns/:id
campaigns.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  const campaign = await getCampaignById(c.env, id);
  
  if (!campaign) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  
  // Verify ownership
  const client = await getClientById(c.env, campaign.clientId);
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  return c.json({ campaign });
});

// POST /campaigns
campaigns.post("/", zValidator("json", createCampaignSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");
  
  // Verify client ownership
  const client = await getClientById(c.env, data.clientId);
  if (!client) {
    return c.json({ error: "Client not found" }, 404);
  }
  
  if (client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  const campaign = await createCampaign(c.env, {
    id: uuidv4(),
    clientId: data.clientId,
    brandKitId: data.brandKitId || null,
    name: data.name,
    description: data.description || null,
    status: "draft",
    platforms: JSON.stringify(data.platforms),
    targetAudience: data.targetAudience || null,
    budget: data.budget || null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return c.json({ campaign }, 201);
});

// PATCH /campaigns/:id
campaigns.patch("/:id", zValidator("json", updateCampaignSchema), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  // Check ownership
  const existing = await getCampaignById(c.env, id);
  
  if (!existing) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  
  const client = await getClientById(c.env, existing.clientId);
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  const updateData: any = { ...data };
  
  // Convert dates
  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  }
  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  }
  
  // Convert platforms array to JSON string
  if (data.platforms) {
    updateData.platforms = JSON.stringify(data.platforms);
  }
  
  const campaign = await updateCampaign(c.env, id, updateData);
  
  return c.json({ campaign });
});

// DELETE /campaigns/:id
campaigns.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  // Check ownership
  const existing = await getCampaignById(c.env, id);
  
  if (!existing) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  
  const client = await getClientById(c.env, existing.clientId);
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  await deleteCampaign(c.env, id);
  
  return c.json({ message: "Campaign deleted successfully" });
});

export default campaigns;
