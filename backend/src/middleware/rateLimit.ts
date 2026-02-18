import { MiddlewareHandler } from "hono";
import { Env } from "../types";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

export const rateLimitMiddleware = (config: RateLimitConfig = DEFAULT_CONFIG): MiddlewareHandler<{ Bindings: Env }> => {
  return async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || "unknown";
    const key = `ratelimit:${ip}`;
    
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Get current requests
    const data = await c.env.RATE_LIMIT.get(key);
    let requests: number[] = [];
    
    if (data) {
      try {
        requests = JSON.parse(data).filter((time: number) => time > windowStart);
      } catch {
        requests = [];
      }
    }
    
    // Check limit
    if (requests.length >= config.maxRequests) {
      const retryAfter = Math.ceil((requests[0] + config.windowMs - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.json({ 
        error: "Rate limit exceeded",
        retryAfter,
      }, 429);
    }
    
    // Add current request
    requests.push(now);
    
    // Store with TTL
    await c.env.RATE_LIMIT.put(key, JSON.stringify(requests), {
      expirationTtl: Math.ceil(config.windowMs / 1000),
    });
    
    // Add rate limit headers
    c.header("X-RateLimit-Limit", String(config.maxRequests));
    c.header("X-RateLimit-Remaining", String(config.maxRequests - requests.length));
    
    await next();
  };
};

// Stricter rate limit for AI generation endpoints
export const aiRateLimitMiddleware = rateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 AI generations per minute
});
