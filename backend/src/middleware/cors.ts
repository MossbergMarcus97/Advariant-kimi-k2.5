import { MiddlewareHandler } from "hono";

export const corsMiddleware: MiddlewareHandler = async (c, next) => {
  // Allow requests from the frontend domain and localhost
  const allowedOrigins = [
    "https://ea0415f4.advariant-platform.pages.dev",
    "https://advariant-platform.pages.dev",
    "http://localhost:3000",
    "http://localhost:8787",
  ];
  
  const origin = c.req.header("Origin");
  
  if (origin && allowedOrigins.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
  } else {
    c.header("Access-Control-Allow-Origin", "*");
  }
  
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Max-Age", "86400");
  
  if (c.req.method === "OPTIONS") {
    return c.text("", 204);
  }
  
  await next();
};
