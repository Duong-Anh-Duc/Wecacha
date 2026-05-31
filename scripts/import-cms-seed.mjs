import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import {createClient} from "@supabase/supabase-js";

const rootDir = process.cwd();
const imageCache = new Map();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1).replace(/^["']|["']$/g, "");
    process.env[key] ??= value;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function parseCloudinaryUrl(value) {
  const parsed = new URL(value);

  return {
    cloudName: parsed.hostname,
    apiKey: decodeURIComponent(parsed.username),
    apiSecret: decodeURIComponent(parsed.password)
  };
}

function getCloudinaryConfig() {
  if (process.env.CLOUDINARY_URL) {
    return parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  }

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  };
}

function signCloudinaryParams(params, apiSecret) {
  const signatureBase = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${signatureBase}${apiSecret}`).digest("hex");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mimeFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".avif") return "image/avif";
  return "image/jpeg";
}

function publicPathFromUrl(value) {
  if (!value.startsWith("/")) return null;
  return path.join(rootDir, "public", value.slice(1));
}

async function uploadToCloudinary(source, {folder, publicId}) {
  if (imageCache.has(source)) return imageCache.get(source);

  const {cloudName, apiKey, apiSecret} = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary config. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
  }

  const timestamp = Math.round(Date.now() / 1000).toString();
  const params = {
    folder,
    overwrite: "true",
    public_id: publicId,
    timestamp
  };
  const signature = signCloudinaryParams(params, apiSecret);
  const form = new FormData();

  const localPath = publicPathFromUrl(source);
  if (localPath) {
    const buffer = fs.readFileSync(localPath);
    form.append("file", new Blob([buffer], {type: mimeFromFile(localPath)}), path.basename(localPath));
  } else {
    form.append("file", source);
  }

  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Cloudinary upload failed for ${source}`);
  }

  imageCache.set(source, payload.secure_url);
  console.log(`Uploaded ${source} -> ${payload.secure_url}`);
  return payload.secure_url;
}

function loadTsExports(relativePath) {
  const filename = path.join(rootDir, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filename
  }).outputText;
  const exports = {};
  const sandbox = {
    exports,
    require(request) {
      throw new Error(`Unexpected runtime import "${request}" in ${relativePath}`);
    }
  };

  vm.runInNewContext(output, sandbox, {filename});
  return sandbox.exports;
}

function loadMessages(locale) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, "messages", `${locale}.json`), "utf8"));
}

function articleSeeds(imageLibrary, vi, en) {
  return [
    {
      slug: "coffee-culture",
      title_vi: vi.News.coffeeCultureTitle,
      title_en: en.News.coffeeCultureTitle,
      intro_vi: vi.Explore.coffeeCultureDesc,
      intro_en: en.Explore.coffeeCultureDesc,
      content_vi: [
        vi.Explore.coffeeCultureDesc,
        "Với Wecacha, văn hóa cà phê bắt đầu từ vùng trồng, cách hái chọn quả chín và nhịp sống của những cộng đồng chăm cây qua từng mùa sương.",
        "Bài viết này là phần mở đầu cho hành trình nhìn cà phê Sơn La như một câu chuyện văn hóa, không chỉ là một thức uống."
      ].join("\n\n"),
      content_en: [
        en.Explore.coffeeCultureDesc,
        "For Wecacha, coffee culture starts at the growing region, the way ripe cherries are selected and the rhythm of communities caring for trees through misty seasons.",
        "This article opens a journey into Son La coffee as a cultural story, not only a beverage."
      ].join("\n\n"),
      image: imageLibrary.cup,
      secondaryImage: imageLibrary.coffeePour,
      placement: "both",
      sort_order: 1
    },
    {
      slug: "events",
      title_vi: vi.News.eventsTitle,
      title_en: en.News.eventsTitle,
      intro_vi: vi.Explore.eventsDesc,
      intro_en: en.Explore.eventsDesc,
      content_vi: [
        vi.Explore.eventsDesc,
        "Các workshop, buổi thử nếm và chuyến đi về bản giúp người uống gặp trực tiếp câu chuyện phía sau từng mẻ rang.",
        "Wecacha sẽ cập nhật lịch hoạt động, sự kiện ra mắt và những buổi gặp gỡ cộng đồng tại đây."
      ].join("\n\n"),
      content_en: [
        en.Explore.eventsDesc,
        "Workshops, tastings and village journeys help drinkers meet the story behind every roast.",
        "Wecacha will keep launch events, community sessions and field notes updated here."
      ].join("\n\n"),
      image: imageLibrary.village,
      secondaryImage: imageLibrary.farm,
      placement: "news",
      sort_order: 2
    },
    {
      slug: "recipes",
      title_vi: vi.News.recipesTitle,
      title_en: en.News.recipesTitle,
      intro_vi: vi.Explore.recipesDesc,
      intro_en: en.Explore.recipesDesc,
      content_vi: [
        vi.Explore.recipesDesc,
        "Từ phin Việt, pour-over đến cold brew, mỗi công thức cần cân lại theo mức rang, độ xay và nhịp thưởng thức.",
        "Đây là nơi Wecacha lưu các hướng dẫn pha chế để bạn có thể tái hiện hương vị Sơn La tại nhà."
      ].join("\n\n"),
      content_en: [
        en.Explore.recipesDesc,
        "From Vietnamese phin and pour-over to cold brew, every recipe needs to balance roast level, grind size and drinking rhythm.",
        "This is where Wecacha keeps brewing notes so you can recreate Son La flavor at home."
      ].join("\n\n"),
      image: imageLibrary.phin,
      secondaryImage: imageLibrary.beansBowl,
      placement: "news",
      sort_order: 3
    }
  ];
}

async function main() {
  loadEnvFile(path.join(rootDir, ".env.local"));

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const {products} = loadTsExports("lib/content/products.ts");
  const {imageLibrary} = loadTsExports("lib/content/images.ts");
  const messagesVi = loadMessages("vi");
  const messagesEn = loadMessages("en");

  const productRows = [];
  for (const [index, product] of products.entries()) {
    const images = [];
    for (const [imageIndex, image] of product.images.entries()) {
      images.push(
        await uploadToCloudinary(image, {
          folder: "wecacha/products",
          publicId: `${slugify(product.slug)}-${imageIndex + 1}`
        })
      );
    }

    productRows.push({
      slug: product.slug,
      category: product.category,
      name_vi: product.name.vi,
      name_en: product.name.en,
      short_vi: product.short.vi,
      short_en: product.short.en,
      description_vi: product.description.vi,
      description_en: product.description.en,
      farmer_story_vi: product.farmerStory.vi,
      farmer_story_en: product.farmerStory.en,
      price: product.price,
      original_price: product.originalPrice ?? null,
      weight: product.weight,
      altitude: product.altitude,
      roast_vi: product.roast.vi,
      roast_en: product.roast.en,
      origin_vi: product.origin.vi,
      origin_en: product.origin.en,
      notes_vi: product.notes.vi,
      notes_en: product.notes.en,
      brew_guide_vi: product.brewGuide.vi,
      brew_guide_en: product.brewGuide.en,
      journey_vi: product.journey.vi,
      journey_en: product.journey.en,
      images,
      featured: Boolean(product.featured),
      is_visible: true,
      sort_order: index + 1,
      updated_at: new Date().toISOString()
    });
  }

  const articleRows = [];
  for (const article of articleSeeds(imageLibrary, messagesVi, messagesEn)) {
    const imageUrl = await uploadToCloudinary(article.image, {
      folder: "wecacha/articles",
      publicId: `${article.slug}-cover`
    });
    const secondaryImageUrl = await uploadToCloudinary(article.secondaryImage, {
      folder: "wecacha/articles",
      publicId: `${article.slug}-secondary`
    });

    articleRows.push({
      slug: article.slug,
      title_vi: article.title_vi,
      title_en: article.title_en,
      intro_vi: article.intro_vi,
      intro_en: article.intro_en,
      content_vi: article.content_vi,
      content_en: article.content_en,
      image_url: imageUrl,
      secondary_image_url: secondaryImageUrl,
      is_visible: true,
      placement: article.placement,
      sort_order: article.sort_order,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  const productResult = await supabase.from("products").upsert(productRows, {onConflict: "slug"});
  if (productResult.error) throw productResult.error;

  const articleResult = await supabase.from("news_articles").upsert(articleRows, {onConflict: "slug"});
  if (articleResult.error) throw articleResult.error;

  console.log(`Imported ${productRows.length} products and ${articleRows.length} articles.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
