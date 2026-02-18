import { Env, PLATFORM_SPECS, Platform, GenerateRequest } from "../types";

const OPENAI_API_URL = "https://api.openai.com/v1";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";

// GPT Image 1.5 for image generation (replaces DALL-E 3)
export async function generateImageWithGPTImage(
  env: Env,
  prompt: string,
  options: {
    quality?: "high" | "medium" | "low";
    size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto";
  } = {}
): Promise<{ url: string; revisedPrompt?: string }> {
  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1.5",
      prompt,
      size: options.size || "1024x1024",
      quality: options.quality || "high",
      n: 1,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GPT Image 1.5 API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.data[0].url,
    revisedPrompt: data.data[0].revised_prompt,
  };
}

// GPT 5.2 for copy generation
export async function generateCopyWithGPT52(
  env: Env,
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  options: {
    variant?: "gpt-5.2" | "gpt-5.2-instant" | "gpt-5.2-pro";
    maxTokens?: number;
    temperature?: number;
    reasoningEffort?: "low" | "medium" | "high" | "xhigh";
  } = {}
): Promise<string> {
  const model = options.variant || "gpt-5.2";
  
  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature ?? 0.7,
      reasoning_effort: options.reasoningEffort || "high",
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GPT 5.2 API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Gemini 3 Nano Banana Pro for image generation (alternative)
export async function generateImageWithGeminiBanana(
  env: Env,
  prompt: string,
  options: {
    aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3";
  } = {}
): Promise<{ url: string; revisedPrompt?: string }> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `${GEMINI_API_URL}/models/gemini-3-pro-image:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
          aspectRatio: options.aspectRatio || "1:1",
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini Banana Pro API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  // Extract image from response
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData?.mimeType?.startsWith("image/")
  );
  
  if (!imagePart?.inlineData?.data) {
    throw new Error("No image generated from Gemini");
  }
  
  // Convert base64 to data URL
  const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  
  return {
    url: imageUrl,
    revisedPrompt: prompt,
  };
}

// Gemini 3 for text generation (alternative)
export async function generateCopyWithGemini(
  env: Env,
  prompt: string,
  options: {
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `${GEMINI_API_URL}/models/gemini-3-pro:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          maxOutputTokens: options.maxTokens || 1024,
          temperature: options.temperature ?? 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Generate enhanced prompt based on style and platform
export async function generateEnhancedPrompt(
  env: Env,
  basePrompt: string,
  style: string,
  platform: Platform,
  brandKit?: {
    primaryColor?: string;
    voice?: string;
  }
): Promise<string> {
  const stylePrompts: Record<string, string> = {
    photorealistic: "highly detailed, photorealistic, professional photography, sharp focus, cinematic lighting, 8k quality",
    illustrative: "digital illustration, clean vector art style, modern flat design, vibrant colors, professional",
    minimal: "minimalist design, clean lines, generous whitespace, modern aesthetic, professional, elegant simplicity",
    cinematic: "cinematic composition, dramatic lighting, film grain, movie poster style, epic scale, professional",
  };

  const platformContext: Record<Platform, string> = {
    meta: "optimized for social media feed, eye-catching, scroll-stopping, high engagement",
    google: "clean advertising creative, clear messaging, conversion-focused, professional",
    tiktok: "vertical format, mobile-optimized, trendy aesthetic, engaging, youth-focused",
    linkedin: "professional business context, B2B aesthetic, corporate style, executive appeal",
  };

  const brandContext = brandKit ? `
Brand Guidelines:
- Primary color: ${brandKit.primaryColor || "use appropriate colors"}
- Brand voice: ${brandKit.voice || "professional and modern"}
` : "";

  const systemPrompt = `You are an expert advertising creative director. Enhance the following ad concept into a detailed image generation prompt.

Style: ${stylePrompts[style] || stylePrompts.minimal}
Platform: ${platformContext[platform]}
${brandContext}

Original concept: "${basePrompt}"

Provide ONLY the enhanced prompt text, no explanations or markdown. The prompt should be detailed but concise (under 500 characters).`;

  return generateCopyWithGPT52(env, [
    { role: "system", content: "You are an expert advertising creative director." },
    { role: "user", content: systemPrompt }
  ], {
    variant: "gpt-5.2-instant",
    maxTokens: 300,
    temperature: 0.5,
  });
}

// Generate headline variations with GPT 5.2
export async function generateHeadlines(
  env: Env,
  product: string,
  targetAudience: string,
  platform: Platform,
  count = 3
): Promise<string[]> {
  const maxLength = PLATFORM_SPECS[platform].maxHeadlineLength;
  
  const prompt = `Generate ${count} catchy, conversion-optimized headlines for a ${platform} ad.

Product/Service: ${product}
Target Audience: ${targetAudience}

Requirements:
- Maximum ${maxLength} characters each
- Compelling and action-oriented
- Vary in style (question, statement, benefit-focused)
- No emojis
- Plain text only, one per line

Return ONLY the headlines, no numbering or bullets.`;

  const response = await generateCopyWithGPT52(env, [
    { role: "system", content: "You are an expert copywriter specializing in advertising headlines." },
    { role: "user", content: prompt }
  ], {
    variant: "gpt-5.2",
    maxTokens: 200,
    temperature: 0.8,
    reasoningEffort: "medium",
  });

  return response
    .split("\n")
    .map(h => h.trim())
    .filter(h => h.length > 0 && h.length <= maxLength)
    .slice(0, count);
}

// Main generation function using GPT Image 1.5
export async function generateAdCreative(
  env: Env,
  request: GenerateRequest,
  brandKit?: { primaryColor?: string; voice?: string }
): Promise<{ imageUrl: string; enhancedPrompt: string }> {
  // 1. Enhance the prompt using GPT 5.2
  const enhancedPrompt = await generateEnhancedPrompt(
    env,
    request.prompt,
    request.style,
    request.platform,
    brandKit
  );

  // 2. Generate the image using GPT Image 1.5
  const { url: imageUrl } = await generateImageWithGPTImage(env, enhancedPrompt, {
    quality: "high",
  });

  return { imageUrl, enhancedPrompt };
}

// Alternative generation using Gemini 3 Nano Banana Pro
export async function generateAdCreativeWithGemini(
  env: Env,
  request: GenerateRequest,
  brandKit?: { primaryColor?: string; voice?: string }
): Promise<{ imageUrl: string; enhancedPrompt: string }> {
  // Enhance prompt first
  const enhancedPrompt = await generateEnhancedPrompt(
    env,
    request.prompt,
    request.style,
    request.platform,
    brandKit
  );

  // Use Gemini 3 Nano Banana Pro for generation
  const aspectRatios: Record<Platform, "1:1" | "16:9" | "9:16" | "4:3"> = {
    meta: "1:1",
    google: "1:1",
    tiktok: "9:16",
    linkedin: "16:9",
  };

  const { url: imageUrl } = await generateImageWithGeminiBanana(env, enhancedPrompt, {
    aspectRatio: aspectRatios[request.platform],
  });

  return { imageUrl, enhancedPrompt };
}

// Generate complete ad copy with GPT 5.2
export async function generateAdCopy(
  env: Env,
  product: string,
  targetAudience: string,
  platform: Platform,
  tone: string = "professional"
): Promise<{ headlines: string[]; bodyText: string; ctas: string[] }> {
  const specs = PLATFORM_SPECS[platform];
  
  const prompt = `Create complete ad copy for a ${platform} campaign.

Product/Service: ${product}
Target Audience: ${targetAudience}
Tone: ${tone}

Requirements:
- 3 headline options (max ${specs.maxHeadlineLength} chars each)
- 1 body text (max ${specs.maxTextLength} chars)
- 3 CTA options (short, action-oriented)

Format as JSON:
{
  "headlines": ["...", "...", "..."],
  "bodyText": "...",
  "ctas": ["...", "...", "..."]
}`;

  const response = await generateCopyWithGPT52(env, [
    { role: "system", content: "You are an expert advertising copywriter. Return only valid JSON." },
    { role: "user", content: prompt }
  ], {
    variant: "gpt-5.2",
    maxTokens: 500,
    temperature: 0.7,
    reasoningEffort: "high",
  });

  try {
    const parsed = JSON.parse(response);
    return {
      headlines: parsed.headlines || [],
      bodyText: parsed.bodyText || "",
      ctas: parsed.ctas || ["Learn More", "Shop Now", "Get Started"],
    };
  } catch {
    // Fallback if JSON parsing fails
    return {
      headlines: ["Discover More", "Transform Your Experience", "Join Today"],
      bodyText: `Experience the best with ${product}.`,
      ctas: ["Learn More", "Shop Now", "Get Started"],
    };
  }
}
