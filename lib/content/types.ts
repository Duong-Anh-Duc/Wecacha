import type {Locale} from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export type ProductCategory = string;

export type Product = {
  slug: string;
  category: ProductCategory;
  name: Localized;
  short: Localized;
  description: Localized;
  farmerStory: Localized;
  journey: Localized<
    {
      stage: string;
      title: string;
      body: string;
    }[]
  >;
  brewGuide: Localized<string[]>;
  price: number;
  originalPrice?: number;
  weight: string;
  altitude: string;
  roast: Localized;
  origin: Localized;
  notes: Localized<string[]>;
  images: string[];
  featured?: boolean;
};

export type StoryChapter = {
  id: string;
  eyebrow: Localized;
  title: Localized;
  body: Localized<string[]>;
  image: string;
  alt: Localized;
};

export type ExploreCard = {
  id: string;
  topic: Localized;
  title: Localized;
  body: Localized;
  image: string;
};

export type Journey = {
  title: Localized;
  body: Localized;
  image: string;
  href: string;
};
