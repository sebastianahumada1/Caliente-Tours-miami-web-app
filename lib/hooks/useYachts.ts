import { useState, useEffect } from "react";
import {
  getSupabaseBrowserClient,
  getPublicStorageUrl,
} from "@/lib/supabase/client";

export type Yacht = {
  id: number;
  name: string;
  slug: string;
  description: string;
  maxPeople: number;
  maxPeopleImage: string | null;
  priceRange: string;
  mainImage: string;
  morePhotosUrl: string | null;
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

type BoatImages = {
  cabin?: string[];
  deck?: string[];
  yacht?: string[];
  charter?: string[];
  services?: string[];
};

type BoatSpecs = {
  length?: string;
  type?: string;
  year?: number;
};

type BoatRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  max_people: string | null; // La columna max_people contiene la imagen
  price_range: string;
  main_image: string;
  more_photos_url: string | null;
  images: BoatImages | string | null;
  specs: BoatSpecs | string | null;
};

function mapBoatRowToYacht(row: BoatRow): Yacht {
  const parsedImages = normalizeBoatImages(row.images);
  const parsedSpecs = normalizeBoatSpecs(row.specs);

  // max_people contiene la imagen (URL de la imagen)
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    maxPeople: 0, // Valor por defecto, ajustar si hay otra columna para el número
    maxPeopleImage: row.max_people ? getPublicStorageUrl(row.max_people) : null,
    priceRange: row.price_range,
    mainImage: getPublicStorageUrl(row.main_image),
    morePhotosUrl: row.more_photos_url,
    images: parsedImages,
    specs: parsedSpecs,
  };
}

function normalizeBoatImages(images: BoatRow["images"]): Yacht["images"] {
  const parsed = parseJsonField<BoatImages>(images) ?? {};

  return {
    cabin: transformImageArray(parsed.cabin),
    deck: transformImageArray(parsed.deck),
    yacht: transformImageArray(parsed.yacht),
    charter: transformImageArray(parsed.charter),
    services: transformImageArray(parsed.services),
  };
}

function normalizeBoatSpecs(specs: BoatRow["specs"]): Yacht["specs"] {
  const parsed = parseJsonField<BoatSpecs>(specs) ?? {};

  return {
    length: parsed.length ?? "",
    type: parsed.type ?? "",
    year: parsed.year ?? 0,
  };
}

function transformImageArray(list?: string[]) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((item) => getPublicStorageUrl(item));
}

function parseJsonField<T>(value: T | string | null | undefined): T | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn("[supabase-boats] Failed to parse JSON field:", error);
      return null;
    }
  }

  return value;
}

type SupabaseError = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

function getReadableErrorMessage(err: unknown) {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (
    err &&
    typeof err === "object" &&
    ("message" in err || "code" in err || "details" in err)
  ) {
    const supabaseErr = err as SupabaseError;
    if (supabaseErr.message) {
      return supabaseErr.message;
    }
    if (supabaseErr.code || supabaseErr.details) {
      return `Supabase error ${supabaseErr.code ?? ""} ${
        supabaseErr.details ?? ""
      }`.trim();
    }
  }

  return "Unexpected error while loading yachts";
}

export function useYachts() {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadYachts() {
      try {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { data, error: queryError } = await supabase
          .from("boats")
          .select("*")
          .order("id");

        if (queryError) {
          throw queryError;
        }

        if (!data) {
          setYachts([]);
          return;
        }

        const mappedYachts = data.map(mapBoatRowToYacht);
        setYachts(mappedYachts);
      } catch (err) {
        const formattedError = getReadableErrorMessage(err);
        setError(formattedError);
        console.error("[supabase-boats] Error loading yachts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadYachts();
  }, []);

  return { yachts, loading, error };
}

// Utility functions
export function filterYachtsByPrice(yachts: Yacht[], priceRange: string): Yacht[] {
  return yachts.filter(yacht => yacht.priceRange === priceRange);
}

export function getYachtById(yachts: Yacht[], id: number): Yacht | undefined {
  return yachts.find(yacht => yacht.id === id);
}

export function getYachtBySlug(yachts: Yacht[], slug: string): Yacht | undefined {
  return yachts.find(yacht => yacht.slug === slug);
}

