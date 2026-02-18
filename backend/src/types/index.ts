import { D1Database, R2Bucket, KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  // D1 Database
  DB: D1Database;
  
  // R2 Buckets
  ASSETS_BUCKET: R2Bucket;
  GENERATIONS_BUCKET: R2Bucket;
  
  // KV Namespaces
  SESSIONS: KVNamespace;
  RATE_LIMIT: KVNamespace;
  
  // API Keys (set via wrangler secrets)
  OPENAI_API_KEY: string;
  GEMINI_API_KEY?: string;
  JWT_SECRET: string;
  
  // Cloudflare AI Gateway
  AI_GATEWAY_URL?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: "admin" | "user";
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// API Types
export interface CreateClientRequest {
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
}

export interface CreateCampaignRequest {
  clientId: string;
  brandKitId?: string;
  name: string;
  description?: string;
  platforms: string[];
  targetAudience?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export interface GenerateRequest {
  campaignId: string;
  prompt: string;
  headlines: string[];
  ctas: string[];
  platform: "meta" | "google" | "tiktok" | "linkedin";
  style: "photorealistic" | "illustrative" | "minimal" | "cinematic";
  referenceImageUrl?: string;
}

export interface GenerationResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

// Platform specs for ad generation
export const PLATFORM_SPECS = {
  meta: {
    name: "Meta Ads",
    aspectRatios: ["1:1", "4:5", "9:16", "16:9"],
    maxHeadlineLength: 40,
    maxTextLength: 125,
    resolutions: {
      "1:1": { width: 1080, height: 1080 },
      "4:5": { width: 1080, height: 1350 },
      "9:16": { width: 1080, height: 1920 },
      "16:9": { width: 1920, height: 1080 },
    },
  },
  google: {
    name: "Google Ads",
    aspectRatios: ["1:1", "1.91:1", "4:5", "9:16"],
    maxHeadlineLength: 30,
    maxTextLength: 90,
    resolutions: {
      "1:1": { width: 1200, height: 1200 },
      "1.91:1": { width: 1200, height: 628 },
      "4:5": { width: 1200, height: 1500 },
      "9:16": { width: 1080, height: 1920 },
    },
  },
  tiktok: {
    name: "TikTok Ads",
    aspectRatios: ["9:16"],
    maxHeadlineLength: 50,
    maxTextLength: 100,
    resolutions: {
      "9:16": { width: 1080, height: 1920 },
    },
  },
  linkedin: {
    name: "LinkedIn Ads",
    aspectRatios: ["1.91:1", "1:1", "2.3:1"],
    maxHeadlineLength: 70,
    maxTextLength: 150,
    resolutions: {
      "1.91:1": { width: 1200, height: 628 },
      "1:1": { width: 1200, height: 1200 },
      "2.3:1": { width: 1200, height: 522 },
    },
  },
};

export type Platform = keyof typeof PLATFORM_SPECS;
