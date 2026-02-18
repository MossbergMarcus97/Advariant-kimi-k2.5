import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env } from "../types";
import { createJWT } from "../middleware/auth";
import { getUserByEmail, createUser } from "../services/db";
import { v4 as uuidv4 } from "uuid";

const auth = new Hono<{ Bindings: Env }>();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Hash password (simple implementation - use bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

// POST /auth/login
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  
  const user = await getUserByEmail(c.env, email);
  
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  
  const isValid = await verifyPassword(password, user.passwordHash);
  
  if (!isValid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  
  // Create JWT
  const token = await createJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  }, c.env.JWT_SECRET);
  
  // Store session in KV
  await c.env.SESSIONS.put(`session:${user.id}`, JSON.stringify({
    userId: user.id,
    email: user.email,
    createdAt: Date.now(),
  }), { expirationTtl: 7 * 24 * 60 * 60 }); // 7 days
  
  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    },
  });
});

// POST /auth/register
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, firstName, lastName } = c.req.valid("json");
  
  // Check if user exists
  const existingUser = await getUserByEmail(c.env, email);
  
  if (existingUser) {
    return c.json({ error: "User already exists" }, 409);
  }
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
  const user = await createUser(c.env, {
    id: uuidv4(),
    email,
    passwordHash,
    firstName: firstName || null,
    lastName: lastName || null,
    avatarUrl: null,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  // Create JWT
  const token = await createJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  }, c.env.JWT_SECRET);
  
  // Store session
  await c.env.SESSIONS.put(`session:${user.id}`, JSON.stringify({
    userId: user.id,
    email: user.email,
    createdAt: Date.now(),
  }), { expirationTtl: 7 * 24 * 60 * 60 });
  
  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    },
  }, 201);
});

// POST /auth/logout
auth.post("/logout", async (c) => {
  const authHeader = c.req.header("Authorization");
  
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { verifyJWT } = await import("../middleware/auth");
      const token = authHeader.substring(7);
      const payload = await verifyJWT(token, c.env.JWT_SECRET);
      
      // Delete session
      await c.env.SESSIONS.delete(`session:${payload.sub}`);
    } catch {
      // Ignore errors
    }
  }
  
  return c.json({ message: "Logged out successfully" });
});

// GET /auth/me
auth.get("/me", async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  return c.json({ user });
});

export default auth;
