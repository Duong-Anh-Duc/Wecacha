import {createHash} from "node:crypto";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type UploadOptions = {
  folder?: string;
  publicId?: string;
};

function parseCloudinaryUrl(value: string): CloudinaryConfig | null {
  try {
    const parsed = new URL(value);
    const cloudName = parsed.hostname || parsed.pathname.replace(/^\//, "");
    const apiKey = decodeURIComponent(parsed.username);
    const apiSecret = decodeURIComponent(parsed.password);

    if (!cloudName || !apiKey || !apiSecret) {
      return null;
    }

    return {cloudName, apiKey, apiSecret};
  } catch {
    return null;
  }
}

function getCloudinaryConfig(): CloudinaryConfig {
  const fromUrl = process.env.CLOUDINARY_URL ? parseCloudinaryUrl(process.env.CLOUDINARY_URL) : null;

  if (fromUrl) {
    return fromUrl;
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary config. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
    );
  }

  return {cloudName, apiKey, apiSecret};
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

export async function uploadImageToCloudinary(file: File, options: UploadOptions = {}) {
  if (!file || !file.size) {
    throw new Error("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }

  const {cloudName, apiKey, apiSecret} = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = options.folder ?? "wecacha/articles";
  const publicId = options.publicId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const signature = signCloudinaryParams(
    {
      folder,
      public_id: publicId,
      timestamp
    },
    apiSecret
  );

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("signature", signature);
  body.append("folder", folder);
  body.append("public_id", publicId);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "Cloudinary upload failed");
  }

  return {
    publicId: payload.public_id as string,
    secureUrl: payload.secure_url as string
  };
}
