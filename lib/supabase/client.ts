import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase-boats] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export type BoatsTable = {
  id: number;
  name: string;
  slug: string;
  description: string;
  max_people: number;
  max_people_image?: string | null;
  price_range: string;
  main_image: string;
  more_photos_url: string | null;
  images: {
    cabin: string[];
    deck: string[];
    yacht: string[];
    charter: string[];
    services: string[];
  };
  specs: {
    length: string;
    type: string;
    year: number;
  };
};

const supabaseStoragePublicBaseUrl = supabaseUrl
  ? `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/`
  : null;

interface Database {
  public: {
    Tables: {
      boats: {
        Row: BoatsTable;
      };
    };
  };
}

let client: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!client && supabaseUrl && supabaseAnonKey) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return client;
}

export function getPublicStorageUrl(path: string) {
  if (!path) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");

  if (!supabaseStoragePublicBaseUrl) {
    return normalizedPath ? `/${normalizedPath}` : normalizedPath;
  }

  return `${supabaseStoragePublicBaseUrl}${normalizedPath}`;
}


