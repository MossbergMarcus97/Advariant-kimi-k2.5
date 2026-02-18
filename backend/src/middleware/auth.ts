import { MiddlewareHandler } from "hono";
import { jwtVerify, SignJWT } from "jose";
import { Env, JWTPayload, User } from "../types";

const JWT_ALGORITHM = "HS256";

export async function createJWT(payload: Omit<JWTPayload, "iat" | "exp">, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  
  return new SignJWT({ sub: payload.sub, email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  
  const { payload } = await jwtVerify(token, key, {
    algorithms: [JWT_ALGORITHM],
  });
  
  return payload as unknown as JWTPayload;
}

export const authMiddleware: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    
    // Check if session exists in KV
    const session = await c.env.SESSIONS.get(`session:${payload.sub}`);
    if (!session) {
      return c.json({ error: "Unauthorized - Session expired" }, 401);
    }
    
    // Set user in context
    c.set("user", {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    } as User);
    
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }
};

// Optional auth - sets user if token exists but doesn't reject
export const optionalAuthMiddleware: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const payload = await verifyJWT(token, c.env.JWT_SECRET);
      c.set("user", {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      } as User);
    } catch {
      // Invalid token, continue without user
    }
  }
  
  await next();
};
