import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env, User } from "../types";
import { authMiddleware } from "../middleware/auth";
import { 
  createClient, 
  getClientsByUserId, 
  getClientById,
  updateClient,
  deleteClient,
} from "../services/db";
import { v4 as uuidv4 } from "uuid";

const clients = new Hono<{ 
  Bindings: Env;
  Variables: { user: User };
}>();

// All routes require authentication
clients.use("/*", authMiddleware);

// Validation schemas
const createClientSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
});

const updateClientSchema = createClientSchema.partial();

// GET /clients
clients.get("/", async (c) => {
  const user = c.get("user");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");
  
  const clients = await getClientsByUserId(c.env, user.id, limit, offset);
  
  return c.json({ clients });
});

// GET /clients/:id
clients.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  const client = await getClientById(c.env, id);
  
  if (!client) {
    return c.json({ error: "Client not found" }, 404);
  }
  
  // Verify ownership
  if (client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  return c.json({ client });
});

// POST /clients
clients.post("/", zValidator("json", createClientSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");
  
  const client = await createClient(c.env, {
    id: uuidv4(),
    ...data,
    logoUrl: null,
    status: "active",
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return c.json({ client }, 201);
});

// PATCH /clients/:id
clients.patch("/:id", zValidator("json", updateClientSchema), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  // Check ownership
  const existing = await getClientById(c.env, id);
  
  if (!existing) {
    return c.json({ error: "Client not found" }, 404);
  }
  
  if (existing.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  const client = await updateClient(c.env, id, data);
  
  return c.json({ client });
});

// DELETE /clients/:id
clients.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  // Check ownership
  const existing = await getClientById(c.env, id);
  
  if (!existing) {
    return c.json({ error: "Client not found" }, 404);
  }
  
  if (existing.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  await deleteClient(c.env, id);
  
  return c.json({ message: "Client deleted successfully" });
});

export default clients;
