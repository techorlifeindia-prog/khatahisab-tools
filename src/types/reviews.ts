// [TL-TYPES-01: Review Types]

export interface Review {
  id: number | string;
  author: string;
  rating: number;
  text: string;
  time: string;
  replied: boolean;
  rawReply?: { comment: string } | null;
}

export interface ReviewResponse {
  location: string;
  accountName?: string;
  locationName?: string;
  reviews: Review[];
  error?: string;
}

export interface GenerateReplyResponse {
  reply?: string;
  error?: string;
}

export interface PostReplyResponse {
  success?: boolean;
  data?: unknown;
  error?: string;
}
