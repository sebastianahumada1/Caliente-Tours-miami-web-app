export interface GoogleReview {
  authorName: string;
  authorUrl?: string | null;
  profilePhotoUrl?: string | null;
  rating: number;
  relativeTimeDescription?: string | null;
  text: string;
  time: number;
  language?: string | null;
}

export interface ReviewsApiResponse {
  reviews: GoogleReview[];
  totalReviews: number;
  overallRating: number;
  placeName: string;
  lastUpdated: string;
}

