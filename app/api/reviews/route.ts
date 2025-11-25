import { NextResponse } from "next/server";
import type { GoogleReview, ReviewsApiResponse } from "@/lib/types/reviews";

export const revalidate = 3600; // Revalidate each hour to keep reviews fresh

const GOOGLE_PLACES_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID ?? process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

interface GoogleReviewApiResponse {
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: Array<{
      author_name: string;
      author_url?: string;
      profile_photo_url?: string;
      rating: number;
      relative_time_description?: string;
      text: string;
      time: number;
      language?: string;
    }>;
  };
  status: string;
  error_message?: string;
}

export async function GET() {
  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    return NextResponse.json(
      {
        error:
          "Google Places API no está configurado. Asegúrate de definir GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID.",
      },
      { status: 500 },
    );
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", GOOGLE_PLACE_ID);
    url.searchParams.set(
      "fields",
      "name,rating,user_ratings_total,reviews",
    );
    url.searchParams.set("language", "es");
    url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudo contactar Google Places API." },
        { status: response.status },
      );
    }

    const data: GoogleReviewApiResponse = await response.json();

    if (data.status !== "OK" || !data.result) {
      return NextResponse.json(
        {
          error: data.error_message || "No se pudieron obtener las reseñas.",
          status: data.status,
        },
        { status: 502 },
      );
    }

    const reviews: GoogleReview[] =
      data.result.reviews?.map((review) => ({
        authorName: review.author_name,
        authorUrl: review.author_url ?? null,
        profilePhotoUrl: review.profile_photo_url ?? null,
        rating: review.rating,
        relativeTimeDescription: review.relative_time_description ?? null,
        text: review.text,
        time: review.time,
        language: review.language ?? null,
      })) ?? [];

    const payload: ReviewsApiResponse = {
      reviews,
      totalReviews: data.result.user_ratings_total ?? reviews.length,
      overallRating: data.result.rating ?? 0,
      placeName: data.result.name ?? "Caliente Tours Miami",
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las reseñas.",
      },
      { status: 500 },
    );
  }
}

