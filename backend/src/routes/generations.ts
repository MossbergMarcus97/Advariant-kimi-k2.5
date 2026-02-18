import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env, User } from "../types";
import { authMiddleware } from "../middleware/auth";
import { aiRateLimitMiddleware } from "../middleware/rateLimit";
import { 
  createGeneration,
  getGenerationById,
  getGenerationsByCampaignId,
  getCampaignById,
  getClientById,
  getBrandKitById,
  updateGeneration,
} from "../services/db";
import { generateAdCreative, generateHeadlines, generateAdCopy } from "../services/ai";
import { copyImageToR2, generateFileName } from "../services/storage";
import { v4 as uuidv4 } from "uuid";

const generations = new Hono<{ 
  Bindings: Env;
  Variables: { user: User };
}>();

generations.use("/*", authMiddleware);

// Validation schemas
const generateSchema = z.object({
  campaignId: z.string().uuid(),
  prompt: z.string().min(10).max(1000),
  headlines: z.array(z.string()).min(1).max(5),
  ctas: z.array(z.string()).min(1).max(3),
  platform: z.enum(["meta", "google", "tiktok", "linkedin"]),
  style: z.enum(["photorealistic", "illustrative", "minimal", "cinematic"]),
  referenceImageUrl: z.string().url().optional(),
});

// GET /generations - List generations for a campaign
generations.get("/", async (c) => {
  const user = c.get("user");
  const campaignId = c.req.query("campaignId");
  
  if (!campaignId) {
    return c.json({ error: "campaignId is required" }, 400);
  }
  
  // Verify ownership
  const campaign = await getCampaignById(c.env, campaignId);
  
  if (!campaign) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  
  const client = await getClientById(c.env, campaign.clientId);
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  const generations = await getGenerationsByCampaignId(c.env, campaignId);
  
  return c.json({ generations });
});

// GET /generations/:id
generations.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  const generation = await getGenerationById(c.env, id);
  
  if (!generation) {
    return c.json({ error: "Generation not found" }, 404);
  }
  
  // Verify ownership
  const campaign = await getCampaignById(c.env, generation.campaignId);
  const client = await getClientById(c.env, campaign!.clientId);
  
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  return c.json({ generation });
});

// POST /generations - Create new AI generation
generations.post("/", aiRateLimitMiddleware, zValidator("json", generateSchema), async (c) => {
  const user = c.get("user");
  const data = c.req.valid("json");
  
  // Verify campaign ownership
  const campaign = await getCampaignById(c.env, data.campaignId);
  
  if (!campaign) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  
  const client = await getClientById(c.env, campaign.clientId);
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  // Get brand kit if available
  let brandKit;
  if (campaign.brandKitId) {
    brandKit = await getBrandKitById(c.env, campaign.brandKitId) || undefined;
  }
  
  // Create generation record
  const generation = await createGeneration(c.env, {
    id: uuidv4(),
    campaignId: data.campaignId,
    prompt: data.prompt,
    headlines: JSON.stringify(data.headlines),
    ctas: JSON.stringify(data.ctas),
    platform: data.platform,
    style: data.style,
    status: "processing",
    imageUrl: null,
    thumbnailUrl: null,
    metadata: JSON.stringify({
      referenceImageUrl: data.referenceImageUrl,
      startedAt: Date.now(),
    }),
    error: null,
    createdAt: new Date(),
    completedAt: null,
  });
  
  // Start async generation (in production, use Cloudflare Queues)
  c.executionCtx.waitUntil(
    (async () => {
      try {
        // Generate image with AI
        const brandKitData = brandKit ? {
          primaryColor: brandKit.primaryColor || undefined,
          voice: brandKit.voice || undefined,
        } : undefined;
        
        const { imageUrl: aiImageUrl, enhancedPrompt } = await generateAdCreative(
          c.env,
          {
            campaignId: data.campaignId,
            prompt: data.prompt,
            headlines: data.headlines,
            ctas: data.ctas,
            platform: data.platform,
            style: data.style,
            referenceImageUrl: data.referenceImageUrl,
          },
          brandKitData
        );
        
        // Copy image to R2
        const fileName = generateFileName(`${data.platform}-generation.png`);
        const { url: storedUrl } = await copyImageToR2(
          c.env,
          "generations",
          aiImageUrl,
          fileName,
          {
            generationId: generation.id,
            campaignId: data.campaignId,
            platform: data.platform,
          }
        );
        
        // Update generation record
        await updateGeneration(c.env, generation.id, {
          status: "completed",
          imageUrl: storedUrl,
          thumbnailUrl: storedUrl, // In production, create actual thumbnail
          metadata: JSON.stringify({
            referenceImageUrl: data.referenceImageUrl,
            enhancedPrompt,
            startedAt: Date.now(),
            completedAt: Date.now(),
          }),
          completedAt: new Date(),
        });
        
      } catch (error) {
        console.error("Generation failed:", error);
        
        await updateGeneration(c.env, generation.id, {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
          completedAt: new Date(),
        });
      }
    })()
  );
  
  return c.json({ generation }, 202);
});

// POST /generations/suggestions - Get AI ad copy suggestions
generations.post("/suggestions", async (c) => {
  const user = c.get("user");
  const { campaignId, product, targetAudience, platform, tone = "professional" } = await c.req.json();
  
  if (!campaignId || !product || !platform) {
    return c.json({ error: "campaignId, product, and platform are required" }, 400);
  }
  
  // Verify ownership
  const campaign = await getCampaignById(c.env, campaignId);
  
  if (!campaign) {
    return c.json({ error: "Campaign not found" }, 404);
  }
  
  const client = await getClientById(c.env, campaign.clientId);
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  try {
    const adCopy = await generateAdCopy(
      c.env,
      product,
      targetAudience || "general audience",
      platform,
      tone
    );
    
    return c.json({ 
      headlines: adCopy.headlines,
      bodyText: adCopy.bodyText,
      ctas: adCopy.ctas,
    });
  } catch (error) {
    console.error("Copy generation failed:", error);
    return c.json({ error: "Failed to generate copy" }, 500);
  }
});

// POST /generations/:id/regenerate - Regenerate a variant
generations.post("/:id/regenerate", aiRateLimitMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  
  const generation = await getGenerationById(c.env, id);
  
  if (!generation) {
    return c.json({ error: "Generation not found" }, 404);
  }
  
  // Verify ownership
  const campaign = await getCampaignById(c.env, generation.campaignId);
  const client = await getClientById(c.env, campaign!.clientId);
  
  if (!client || client.userId !== user.id) {
    return c.json({ error: "Unauthorized" }, 403);
  }
  
  // Update status to processing
  await updateGeneration(c.env, id, {
    status: "processing",
    error: null,
  });
  
  // Trigger regeneration
  c.executionCtx.waitUntil(
    (async () => {
      try {
        const brandKit = campaign!.brandKitId 
          ? await getBrandKitById(c.env, campaign!.brandKitId!) 
          : null;
        
        const { imageUrl: aiImageUrl, enhancedPrompt } = await generateAdCreative(
          c.env,
          {
            campaignId: generation.campaignId,
            prompt: generation.prompt,
            headlines: JSON.parse(generation.headlines),
            ctas: JSON.parse(generation.ctas),
            platform: generation.platform as any,
            style: generation.style as any,
          },
          brandKit ? {
            primaryColor: brandKit.primaryColor || undefined,
            voice: brandKit.voice || undefined,
          } : undefined
        );
        
        const fileName = generateFileName(`${generation.platform}-regeneration.png`);
        const { url: storedUrl } = await copyImageToR2(
          c.env,
          "generations",
          aiImageUrl,
          fileName,
          {
            generationId: id,
            campaignId: generation.campaignId,
            regenerated: "true",
          }
        );
        
        await updateGeneration(c.env, id, {
          status: "completed",
          imageUrl: storedUrl,
          thumbnailUrl: storedUrl,
          metadata: JSON.stringify({
            ...JSON.parse(generation.metadata || "{}"),
            regeneratedAt: Date.now(),
            enhancedPrompt,
          }),
          completedAt: new Date(),
        });
        
      } catch (error) {
        console.error("Regeneration failed:", error);
        
        await updateGeneration(c.env, id, {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })()
  );
  
  return c.json({ message: "Regeneration started" });
});

export default generations;
