// API client for AdVariant backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://advariant-api.YOUR_SUBDOMAIN.workers.dev";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  
  register: (email: string, password: string, firstName?: string, lastName?: string) =>
    api<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: { email, password, firstName, lastName },
    }),
  
  logout: (token: string) =>
    api("/auth/logout", {
      method: "POST",
      token,
    }),
  
  me: (token: string) =>
    api<{ user: User }>("/auth/me", { token }),
};

// Client API
export const clientApi = {
  list: (token: string) =>
    api<{ clients: Client[] }>("/clients", { token }),
  
  get: (id: string, token: string) =>
    api<{ client: Client }>(`/clients/${id}`, { token }),
  
  create: (data: CreateClientData, token: string) =>
    api<{ client: Client }>("/clients", {
      method: "POST",
      body: data,
      token,
    }),
  
  update: (id: string, data: Partial<CreateClientData>, token: string) =>
    api<{ client: Client }>(`/clients/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
  
  delete: (id: string, token: string) =>
    api(`/clients/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Campaign API
export const campaignApi = {
  list: (token: string, filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    const query = params.toString() ? `?${params.toString()}` : "";
    return api<{ campaigns: Campaign[] }>(`/campaigns${query}`, { token });
  },
  
  get: (id: string, token: string) =>
    api<{ campaign: Campaign }>(`/campaigns/${id}`, { token }),
  
  create: (data: CreateCampaignData, token: string) =>
    api<{ campaign: Campaign }>("/campaigns", {
      method: "POST",
      body: data,
      token,
    }),
  
  update: (id: string, data: Partial<CreateCampaignData>, token: string) =>
    api<{ campaign: Campaign }>(`/campaigns/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
  
  delete: (id: string, token: string) =>
    api(`/campaigns/${id}`, {
      method: "DELETE",
      token,
    }),
};

// Generation API
export const generationApi = {
  list: (campaignId: string, token: string) =>
    api<{ generations: Generation[] }>(`/generations?campaignId=${campaignId}`, { token }),
  
  get: (id: string, token: string) =>
    api<{ generation: Generation }>(`/generations/${id}`, { token }),
  
  create: (data: GenerateRequest, token: string) =>
    api<{ generation: Generation }>("/generations", {
      method: "POST",
      body: data,
      token,
    }),
  
  suggestions: (data: {
    campaignId: string;
    product: string;
    targetAudience?: string;
    platform: string;
    count?: number;
  }, token: string) =>
    api<{ headlines: string[] }>("/generations/suggestions", {
      method: "POST",
      body: data,
      token,
    }),
  
  regenerate: (id: string, token: string) =>
    api(`/generations/${id}/regenerate`, {
      method: "POST",
      token,
    }),
};

// Upload API
export const uploadApi = {
  uploadAsset: async (file: File, clientId: string, token: string, campaignId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("clientId", clientId);
    if (campaignId) formData.append("campaignId", campaignId);
    
    const response = await fetch(`${API_BASE_URL}/uploads/assets`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error);
    }
    
    return response.json() as Promise<{ asset: Asset }>;
  },
};

// Dashboard API
export const dashboardApi = {
  stats: (token: string) =>
    api<{
      activeCampaigns: number;
      totalGenerations: number;
      totalClients: number;
      totalBrandKits: number;
      recentActivity: unknown[];
    }>("/dashboard/stats", { token }),
};

// Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: "admin" | "user";
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  status: "active" | "inactive";
  userId: string;
  campaignCount?: number;
  brandKitCount?: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  clientId: string;
  brandKitId?: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "paused" | "completed";
  platforms: string[];
  targetAudience?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  client?: Client;
  generations?: Generation[];
}

export interface Generation {
  id: string;
  campaignId: string;
  prompt: string;
  headlines: string[];
  ctas: string[];
  platform: "meta" | "google" | "tiktok" | "linkedin";
  style: "photorealistic" | "illustrative" | "minimal" | "cinematic";
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Asset {
  id: string;
  clientId: string;
  campaignId?: string;
  name: string;
  type: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface CreateClientData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
}

export interface CreateCampaignData {
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
