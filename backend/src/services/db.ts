import { drizzle } from "drizzle-orm/d1";
import { eq, desc, and, like } from "drizzle-orm";
import * as schema from "../db/schema";
import { Env } from "../types";

export function getDB(env: Env) {
  return drizzle(env.DB, { schema });
}

// User operations
export async function createUser(env: Env, user: typeof schema.users.$inferInsert) {
  const db = getDB(env);
  return db.insert(schema.users).values(user).returning().get();
}

export async function getUserByEmail(env: Env, email: string) {
  const db = getDB(env);
  return db.select().from(schema.users).where(eq(schema.users.email, email)).get();
}

export async function getUserById(env: Env, id: string) {
  const db = getDB(env);
  return db.select().from(schema.users).where(eq(schema.users.id, id)).get();
}

// Client operations
export async function createClient(env: Env, client: typeof schema.clients.$inferInsert) {
  const db = getDB(env);
  return db.insert(schema.clients).values(client).returning().get();
}

export async function getClientsByUserId(env: Env, userId: string, limit = 50, offset = 0) {
  const db = getDB(env);
  
  const clients = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.userId, userId))
    .orderBy(desc(schema.clients.createdAt))
    .limit(limit)
    .offset(offset)
    .all();
  
  // Get counts for each client
  const clientsWithCounts = await Promise.all(
    clients.map(async (client) => {
      const campaigns = await db
        .select({ count: { id: schema.campaigns.id } })
        .from(schema.campaigns)
        .where(eq(schema.campaigns.clientId, client.id))
        .all();
      
      const brandKits = await db
        .select({ count: { id: schema.brandKits.id } })
        .from(schema.brandKits)
        .where(eq(schema.brandKits.clientId, client.id))
        .all();
      
      return {
        ...client,
        campaignCount: campaigns.length,
        brandKitCount: brandKits.length,
      };
    })
  );
  
  return clientsWithCounts;
}

export async function getClientById(env: Env, id: string) {
  const db = getDB(env);
  const client = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, id))
    .get();
  
  if (!client) return null;
  
  // Fetch related data separately
  const campaigns = await db
    .select()
    .from(schema.campaigns)
    .where(eq(schema.campaigns.clientId, id))
    .orderBy(desc(schema.campaigns.createdAt))
    .all();
  
  const brandKits = await db
    .select()
    .from(schema.brandKits)
    .where(eq(schema.brandKits.clientId, id))
    .orderBy(desc(schema.brandKits.createdAt))
    .all();
  
  const assets = await db
    .select()
    .from(schema.assets)
    .where(eq(schema.assets.clientId, id))
    .orderBy(desc(schema.assets.createdAt))
    .limit(10)
    .all();
  
  return {
    ...client,
    campaigns,
    brandKits,
    assets,
  };
}

export async function updateClient(env: Env, id: string, data: Partial<typeof schema.clients.$inferInsert>) {
  const db = getDB(env);
  return db.update(schema.clients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.clients.id, id))
    .returning()
    .get();
}

export async function deleteClient(env: Env, id: string) {
  const db = getDB(env);
  return db.delete(schema.clients).where(eq(schema.clients.id, id)).run();
}

// Campaign operations
export async function createCampaign(env: Env, campaign: typeof schema.campaigns.$inferInsert) {
  const db = getDB(env);
  return db.insert(schema.campaigns).values(campaign).returning().get();
}

export async function getCampaignsByUserId(env: Env, userId: string, filters?: { status?: string; search?: string }) {
  const db = getDB(env);
  
  // First get client IDs for this user
  const userClients = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(eq(schema.clients.userId, userId))
    .all();
  
  const clientIds = userClients.map(c => c.id);
  
  if (clientIds.length === 0) return [];
  
  // Build conditions
  let conditions: any[] = [];
  
  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(schema.campaigns.status, filters.status));
  }
  
  if (filters?.search) {
    conditions.push(like(schema.campaigns.name, `%${filters.search}%`));
  }
  
  // Get campaigns for these clients
  const campaigns = await db
    .select()
    .from(schema.campaigns)
    .where(and(
      ...clientIds.map(id => eq(schema.campaigns.clientId, id)),
      ...conditions
    ))
    .orderBy(desc(schema.campaigns.createdAt))
    .all();
  
  // Enrich with client data
  const enrichedCampaigns = await Promise.all(
    campaigns.map(async (campaign) => {
      const client = await db
        .select()
        .from(schema.clients)
        .where(eq(schema.clients.id, campaign.clientId))
        .get();
      
      const generations = await db
        .select()
        .from(schema.generations)
        .where(eq(schema.generations.campaignId, campaign.id))
        .orderBy(desc(schema.generations.createdAt))
        .limit(10)
        .all();
      
      return {
        ...campaign,
        client,
        generations,
      };
    })
  );
  
  return enrichedCampaigns;
}

export async function getCampaignById(env: Env, id: string) {
  const db = getDB(env);
  const campaign = await db
    .select()
    .from(schema.campaigns)
    .where(eq(schema.campaigns.id, id))
    .get();
  
  if (!campaign) return null;
  
  // Fetch related data
  const client = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, campaign.clientId))
    .get();
  
  const brandKit = campaign.brandKitId 
    ? await db.select().from(schema.brandKits).where(eq(schema.brandKits.id, campaign.brandKitId)).get()
    : null;
  
  const generations = await db
    .select()
    .from(schema.generations)
    .where(eq(schema.generations.campaignId, id))
    .orderBy(desc(schema.generations.createdAt))
    .all();
  
  return {
    ...campaign,
    client,
    brandKit,
    generations,
  };
}

export async function updateCampaign(env: Env, id: string, data: Partial<typeof schema.campaigns.$inferInsert>) {
  const db = getDB(env);
  return db.update(schema.campaigns)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.campaigns.id, id))
    .returning()
    .get();
}

export async function deleteCampaign(env: Env, id: string) {
  const db = getDB(env);
  return db.delete(schema.campaigns).where(eq(schema.campaigns.id, id)).run();
}

// Generation operations
export async function createGeneration(env: Env, generation: typeof schema.generations.$inferInsert) {
  const db = getDB(env);
  return db.insert(schema.generations).values(generation).returning().get();
}

export async function getGenerationById(env: Env, id: string) {
  const db = getDB(env);
  const generation = await db
    .select()
    .from(schema.generations)
    .where(eq(schema.generations.id, id))
    .get();
  
  if (!generation) return null;
  
  const campaign = await db
    .select()
    .from(schema.campaigns)
    .where(eq(schema.campaigns.id, generation.campaignId))
    .get();
  
  return { ...generation, campaign };
}

export async function getGenerationsByCampaignId(env: Env, campaignId: string) {
  const db = getDB(env);
  return db
    .select()
    .from(schema.generations)
    .where(eq(schema.generations.campaignId, campaignId))
    .orderBy(desc(schema.generations.createdAt))
    .all();
}

export async function updateGeneration(env: Env, id: string, data: Partial<typeof schema.generations.$inferInsert>) {
  const db = getDB(env);
  return db.update(schema.generations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.generations.id, id))
    .returning()
    .get();
}

// Asset operations
export async function createAsset(env: Env, asset: typeof schema.assets.$inferInsert) {
  const db = getDB(env);
  return db.insert(schema.assets).values(asset).returning().get();
}

export async function getAssetsByClientId(env: Env, clientId: string) {
  const db = getDB(env);
  return db
    .select()
    .from(schema.assets)
    .where(eq(schema.assets.clientId, clientId))
    .orderBy(desc(schema.assets.createdAt))
    .all();
}

export async function deleteAsset(env: Env, id: string) {
  const db = getDB(env);
  return db.delete(schema.assets).where(eq(schema.assets.id, id)).run();
}

// Brand Kit operations
export async function createBrandKit(env: Env, brandKit: typeof schema.brandKits.$inferInsert) {
  const db = getDB(env);
  return db.insert(schema.brandKits).values(brandKit).returning().get();
}

export async function getBrandKitsByClientId(env: Env, clientId: string) {
  const db = getDB(env);
  return db
    .select()
    .from(schema.brandKits)
    .where(eq(schema.brandKits.clientId, clientId))
    .orderBy(desc(schema.brandKits.createdAt))
    .all();
}

export async function getBrandKitById(env: Env, id: string) {
  const db = getDB(env);
  return db
    .select()
    .from(schema.brandKits)
    .where(eq(schema.brandKits.id, id))
    .get();
}
