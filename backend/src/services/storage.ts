import { Env } from "../types";

// Generate a unique filename
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split(".").pop() || "bin";
  return `${timestamp}-${random}.${extension}`;
}

// Upload image to R2
export async function uploadImage(
  env: Env,
  bucket: "assets" | "generations",
  fileName: string,
  data: ArrayBuffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ url: string; key: string }> {
  const r2Bucket = bucket === "assets" ? env.ASSETS_BUCKET : env.GENERATIONS_BUCKET;
  const key = `${bucket}/${fileName}`;
  
  await r2Bucket.put(key, data, {
    httpMetadata: {
      contentType,
    },
    customMetadata: metadata,
  });
  
  // Construct the public URL (you'll need to configure public access in R2)
  // For now, return a signed URL pattern
  return {
    url: `https://${bucket}.advariant.io/${key}`,
    key,
  };
}

// Get image from R2
export async function getImage(
  env: Env,
  bucket: "assets" | "generations",
  key: string
): Promise<Response> {
  const r2Bucket = bucket === "assets" ? env.ASSETS_BUCKET : env.GENERATIONS_BUCKET;
  const object = await r2Bucket.get(key);
  
  if (!object) {
    return new Response("Not found", { status: 404 });
  }
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000"); // 1 year cache
  
  return new Response(object.body, { headers });
}

// Delete image from R2
export async function deleteImage(
  env: Env,
  bucket: "assets" | "generations",
  key: string
): Promise<void> {
  const r2Bucket = bucket === "assets" ? env.ASSETS_BUCKET : env.GENERATIONS_BUCKET;
  await r2Bucket.delete(key);
}

// Copy image from URL to R2 (for AI-generated images)
export async function copyImageToR2(
  env: Env,
  bucket: "assets" | "generations",
  sourceUrl: string,
  targetFileName: string,
  metadata?: Record<string, string>
): Promise<{ url: string; key: string; size: number }> {
  // Fetch the image from the source URL
  const response = await fetch(sourceUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  
  const contentType = response.headers.get("content-type") || "image/png";
  const arrayBuffer = await response.arrayBuffer();
  
  // Upload to R2
  const result = await uploadImage(env, bucket, targetFileName, arrayBuffer, contentType, metadata);
  
  return {
    ...result,
    size: arrayBuffer.byteLength,
  };
}

// Create a thumbnail version (simple resize)
export async function createThumbnail(
  env: Env,
  imageData: ArrayBuffer,
  maxWidth = 400,
  maxHeight = 400
): Promise<ArrayBuffer> {
  // Note: In a real implementation, you'd use a WASM image processing library
  // like sharp or wasm-vips. For now, we'll return the original.
  // Cloudflare Images API could also be used for on-the-fly resizing.
  
  // Placeholder: return original
  // TODO: Implement actual image resizing
  return imageData;
}

// Get presigned URL for direct upload
export async function getPresignedUploadUrl(
  env: Env,
  bucket: "assets" | "generations",
  fileName: string,
  contentType: string,
  expiresIn = 300 // 5 minutes
): Promise<{ url: string; fields: Record<string, string> }> {
  const r2Bucket = bucket === "assets" ? env.ASSETS_BUCKET : env.GENERATIONS_BUCKET;
  const key = `${bucket}/${fileName}`;
  
  // R2 doesn't have built-in presigned URLs like S3, but we can create a custom endpoint
  // For now, return a placeholder structure
  // In production, you'd implement custom signed URL logic
  
  return {
    url: `/api/upload/${bucket}`,
    fields: {
      key,
      "Content-Type": contentType,
    },
  };
}
