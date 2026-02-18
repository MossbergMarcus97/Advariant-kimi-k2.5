import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user").notNull(), // admin, user
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Clients table
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  logoUrl: text("logo_url"),
  website: text("website"),
  industry: text("industry"),
  status: text("status").default("active").notNull(), // active, inactive
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Brand Kits table
export const brandKits = sqliteTable("brand_kits", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  accentColor: text("accent_color"),
  fontHeading: text("font_heading"),
  fontBody: text("font_body"),
  logoUrl: text("logo_url"),
  voice: text("voice"), // Brand voice description
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Campaigns table
export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id),
  brandKitId: text("brand_kit_id").references(() => brandKits.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("draft").notNull(), // draft, active, paused, completed
  platforms: text("platforms").notNull(), // JSON array: ["meta", "google", "tiktok", "linkedin"]
  targetAudience: text("target_audience"),
  budget: real("budget"),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Generations table (AI generated content)
export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").notNull().references(() => campaigns.id),
  prompt: text("prompt").notNull(),
  headlines: text("headlines").notNull(), // JSON array
  ctas: text("ctas").notNull(), // JSON array
  platform: text("platform").notNull(), // meta, google, tiktok, linkedin
  style: text("style").notNull(), // photorealistic, illustrative, minimal, cinematic
  status: text("status").default("pending").notNull(), // pending, processing, completed, failed
  imageUrl: text("image_url"), // R2 URL
  thumbnailUrl: text("thumbnail_url"),
  metadata: text("metadata"), // JSON with generation params
  error: text("error"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

// Assets table (uploaded images)
export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().references(() => clients.id),
  campaignId: text("campaign_id").references(() => campaigns.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // image, video, document
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // bytes
  url: text("url").notNull(), // R2 URL
  thumbnailUrl: text("thumbnail_url"),
  metadata: text("metadata"), // JSON with dimensions, etc
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  brandKits: many(brandKits),
  campaigns: many(campaigns),
  assets: many(assets),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  client: one(clients, {
    fields: [campaigns.clientId],
    references: [clients.id],
  }),
  brandKit: one(brandKits, {
    fields: [campaigns.brandKitId],
    references: [brandKits.id],
  }),
  generations: many(generations),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [generations.campaignId],
    references: [campaigns.id],
  }),
}));
