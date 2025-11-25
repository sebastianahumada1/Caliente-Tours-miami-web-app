import { useEffect, useState } from "react";
import type { GoogleReview, ReviewsApiResponse } from "@/lib/types/reviews";

interface ReviewsState {
  reviews: GoogleReview[];
  totalReviews: number;
  overallRating: number;
  placeName: string;
  lastUpdated: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  totalReviews: 0,
  overallRating: 0,
  placeName: "",
  lastUpdated: null,
};

export function useReviews() {
  const [data, setData] = useState<ReviewsState>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews(isManualRefresh = false) {
      try {
        if (isManualRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = await fetch("/api/reviews", {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron obtener las reseñas en este momento.");
        }

        const payload: ReviewsApiResponse = await response.json();

        if (isMounted) {
          setData({
            reviews: payload.reviews,
            totalReviews: payload.totalReviews,
            overallRating: payload.overallRating,
            placeName: payload.placeName,
            lastUpdated: payload.lastUpdated,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Error desconocido al cargar las reseñas.",
          );
        }
      } finally {
        if (isMounted) {
          if (isManualRefresh) {
            setIsRefreshing(false);
          } else {
            setIsLoading(false);
          }
        }
      }
    }

    fetchReviews(refreshToken > 0);

    return () => {
      isMounted = false;
    };
  }, [refreshToken]);

  return {
    ...data,
    isLoading,
    isRefreshing,
    error,
    refresh: () => setRefreshToken((prev) => prev + 1),
  };
}

