"use client";

import { useMemo } from "react";
import { Star, Loader2 } from "lucide-react";
import { useReviews } from "@/lib/hooks/useReviews";
import type { GoogleReview } from "@/lib/types/reviews";

export default function ReviewsPage() {
  const {
    reviews,
    totalReviews,
    overallRating,
    placeName,
    lastUpdated,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useReviews();

  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    const date = new Date(lastUpdated);
    return date.toLocaleString("es-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [lastUpdated]);

  return (
    <main
      data-lenis-prevent
      className="min-h-screen bg-black text-white pt-20 md:pt-24 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12">
          <div>
            <p
              className="text-xs md:text-sm uppercase tracking-widest text-pink-400"
              style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}
            >
              Real customer feedback
            </p>
            <h1
              className="text-3xl md:text-5xl font-bold mt-2"
              style={{ fontFamily: "'Bank Gothic Medium', 'Arial Black', sans-serif" }}
            >
              Guest experiences with {placeName || "Caliente Tours Miami"}
            </h1>
            <p className="text-gray-300 mt-4 max-w-3xl text-lg">
              We pull verified Google Maps reviews so you can see authentic guest
              experiences. Click the refresh button any time to grab the latest comments
              straight from Google.
            </p>
          </div>

          <section className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur">
              <div className="flex items-baseline gap-3 md:gap-4">
                <span className="text-4xl md:text-6xl font-black text-white">
                  {overallRating ? overallRating.toFixed(1) : "—"}
                </span>
                <div>
                  <StarRating rating={overallRating} />
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    Based on {totalReviews ? totalReviews.toLocaleString() : "—"} verified reviews
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-pink-600/80 to-purple-700/70 p-4 md:p-6 shadow-2xl">
              <p className="text-sm uppercase tracking-widest text-white/80 mb-2">
                Official source
              </p>
              <p className="text-xl font-semibold">Google Maps</p>
              <p className="text-white/80 mt-2 text-sm">
                We display reviews exactly as they appear on Google. Click any author to read
                the original post.
              </p>
              <a
                href="https://maps.app.goo.gl/L3XvFU4LHjUhkqBk6"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View business on Google
              </a>
              <button
                onClick={refresh}
                disabled={isRefreshing}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh reviews"
                )}
              </button>
              {formattedLastUpdated && (
                <p className="mt-3 text-xs text-white/70 flex items-center gap-2">
                  Last updated: {formattedLastUpdated}
                </p>
              )}
            </div>
          </section>
        </div>

        {isLoading ? (
          <ReviewsSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            <p className="font-semibold">We couldn’t load the reviews.</p>
            <p className="text-sm opacity-80 mt-1">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
            No reviews available right now. Please try again later.
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={`${review.authorName}-${review.time}`} review={review} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const filledStars = Math.round(safeRating);
  return (
    <div className="flex items-center gap-1 text-pink-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${index < filledStars ? "fill-current" : "text-white/30"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const formattedDate =
    review.relativeTimeDescription ??
    new Date(review.time * 1000).toLocaleDateString("es-US", {
      year: "numeric",
      month: "long",
    });

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-full border border-white/20 bg-white/10 flex-shrink-0">
          {review.profilePhotoUrl ? (
            <img
              src={review.profilePhotoUrl}
              alt={review.authorName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-base md:text-lg font-bold text-white">
              {review.authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base md:text-lg font-semibold text-white hover:text-pink-300 transition truncate block"
            >
              {review.authorName}
            </a>
          ) : (
            <p className="text-base md:text-lg font-semibold text-white truncate">{review.authorName}</p>
          )}
          <StarRating rating={review.rating} />
          <p className="text-xs md:text-sm text-gray-400">{formattedDate}</p>
        </div>
      </div>
      <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-100 leading-relaxed">{review.text}</p>
    </article>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className="animate-pulse rounded-3xl border border-white/5 bg-white/5 p-4 md:p-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-white/10" />
              <div className="h-4 w-1/3 rounded bg-white/10" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-5/6 rounded bg-white/10" />
            <div className="h-3 w-4/6 rounded bg-white/10" />
          </div>
        </div>
      ))}
      <div className="col-span-full flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading live reviews from Google Maps...
      </div>
    </div>
  );
}

