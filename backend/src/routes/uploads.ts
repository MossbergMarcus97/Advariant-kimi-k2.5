import { Hono } from "hono";
import { Env, User } from "../types";
import { authMiddleware } from "../middleware/auth";
import { uploadImage, generateFileName, getImage } from "../services/storage";
import { createAsset } from "../services/db";
import { v4 as uuidv4 } from "uuid";

const uploads = new Hono<{ 
  Bindings: Env;
  Variables: { user: User };
}>();

uploads.use("/*", authMiddleware);

// POST /uploads/assets - Upload a brand asset
uploads.post("/assets", async (c) => {
  const user = c.get("user");
  const formData = await c.req.formData();
  
  const file = formData.get("file") as File | null;
  const clientId = formData.get("clientId") as string;
  const campaignId = formData.get("campaignId") as string | null;
  
  if (!file || !clientId) {
    return c.json({ error: "File and clientId are required" }, 400);
  }
  
  // Verify file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" }, 400);
  }
  
  // Verify file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return c.json({ error: "File too large. Maximum size is 10MB" }, 400);
  }
  
  // Upload to R2
  const fileName = generateFileName(file.name);
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const { url } = await uploadImage(c.env, "assets", fileName, arrayBuffer, file.type, {
      originalName: file.name,
      uploadedBy: user.id,
    });
    
    // Create asset record
    const asset = await createAsset(c.env, {
      id: uuidv4(),
      clientId,
      campaignId: campaignId || null,
      name: file.name,
      type: "image",
      mimeType: file.type,
      size: file.size,
      url,
      thumbnailUrl: url, // In production, generate thumbnail
      metadata: JSON.stringify({
        originalName: file.name,
      }),
      createdAt: new Date(),
    });
    
    return c.json({ asset }, 201);
    
  } catch (error) {
    console.error("Upload failed:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

// GET /uploads/assets/:key - Serve an asset
uploads.get("/assets/*", async (c) => {
  const key = c.req.path.replace("/uploads/assets/", "");
  
  if (!key) {
    return c.json({ error: "Key is required" }, 400);
  }
  
  return getImage(c.env, "assets", `assets/${key}`);
});

// GET /uploads/generations/:key - Serve a generated image
uploads.get("/generations/*", async (c) => {
  const key = c.req.path.replace("/uploads/generations/", "");
  
  if (!key) {
    return c.json({ error: "Key is required" }, 400);
  }
  
  return getImage(c.env, "generations", `generations/${key}`);
});

export default uploads;
