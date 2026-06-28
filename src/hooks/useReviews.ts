// [TL-DASHBOARD-02: useReviews Hook]

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Review } from '@/types/reviews';

const MOCK_REVIEWS: Review[] = [
  { id: 1, author: "Karan Kumar", rating: 5, text: "", time: "44 weeks ago", replied: true },
  { id: 2, author: "Bheraram Bheraram dewasi", rating: 5, text: "", time: "44 weeks ago", replied: true },
  { id: 3, author: "sushanta mohakud", rating: 5, text: "", time: "44 weeks ago", replied: true },
  { id: 4, author: "Sutapa Mukherjee", rating: 5, text: "Products responce is fantastic by end users and also very good in built battary quality.... The brand Orlife will rule the trade very soon", time: "44 weeks ago", replied: true },
  { id: 5, author: "dhanrajdewasi", rating: 5, text: "orlife असा ब्रांड हे", time: "44 weeks ago", replied: true },
  { id: 6, author: "BHART MOBILE", rating: 5, text: "Good quality 💯☑️ 100 og sell best quality", time: "45 weeks ago", replied: true },
  { id: 7, author: "Jodha Patel", rating: 5, text: "Accha quality", time: "46 weeks ago", replied: true },
  { id: 8, author: "Babulal Ghanchi", rating: 5, text: "", time: "46 weeks ago", replied: true },
  { id: 9, author: "Dinesh kumar Patel", rating: 5, text: "", time: "46 weeks ago", replied: true },
  { id: 10, author: "SUTHAR SOMU", rating: 5, text: "Best quality product", time: "46 weeks ago", replied: false },
  { id: 11, author: "Sawai Sankhla", rating: 5, text: "ORLIFE is. Super item 👌", time: "46 weeks ago", replied: true },
  { id: 12, author: "Raval Ram", rating: 5, text: "Sbse best super yaha pe hall sel ret se milta hr koi aaitm kipya jrur pdare", time: "46 weeks ago", replied: true },
  { id: 13, author: "Raju Goud", rating: 5, text: "Best Quality", time: "48 weeks ago", replied: false },
  { id: 14, author: "Chaganlal Ghanchi", rating: 5, text: "", time: "48 weeks ago", replied: false },
  { id: 15, author: "Khetaram Ghanchi", rating: 5, text: "", time: "48 weeks ago", replied: false },
  { id: 16, author: "Parasmal", rating: 5, text: "", time: "48 weeks ago", replied: false },
  { id: 17, author: "Dilip Borana", rating: 5, text: "", time: "48 weeks ago", replied: false },
];

export function useReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [locationName, setLocationName] = useState("Chamunda industries");
  const [accountResource, setAccountResource] = useState<string | null>(null);
  const [locationResource, setLocationResource] = useState<string | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isReplyingBulk, setIsReplyingBulk] = useState(false);
  const [replyingId, setReplyingId] = useState<number | string | null>(null);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setIsLoadingReviews(true);
      fetch('/api/reviews')
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setApiError(data.error);
          } else {
            if (data.reviews && data.reviews.length > 0) {
              setReviews(data.reviews);
            }
            if (data.location) {
              setLocationName(data.location);
            }
            if (data.accountName) {
              setAccountResource(data.accountName);
            }
            if (data.locationName) {
              setLocationResource(data.locationName);
            }
          }
        })
        .catch(err => {
          console.error(err);
          setApiError("Failed to fetch real data");
        })
        .finally(() => setIsLoadingReviews(false));
    }
  }, [session]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBulkReply = async () => {
    setIsReplyingBulk(true);
    setProgress(0);
    
    for (let i = 0; i < reviews.length; i++) {
      if (!reviews[i].replied) {
        // Simulate API call to /api/bulk-reply
        await new Promise(resolve => setTimeout(resolve, 1500));
        setReviews(prev => prev.map((r, idx) => idx === i ? { ...r, replied: true } : r));
        setProgress(Math.round(((i + 1) / reviews.length) * 100));
      }
    }
    
    setTimeout(() => {
      setIsReplyingBulk(false);
      showToast("All reviews replied successfully! 🎉");
    }, 1000);
  };

  const handleSingleReply = async (id: number | string) => {
    setReplyingId(id);
    try {
      const reviewToReply = reviews.find(r => r.id === id);
      if (!reviewToReply) return;

      // 1. Generate Reply with AI
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: reviewToReply.text,
          rating: reviewToReply.rating,
          customerName: reviewToReply.author,
          businessName: locationName
        })
      });

      const data = await res.json();

      if (data.error) {
        showToast(`❌ AI Error: ${data.error}`);
        setReplyingId(null);
        return;
      }

      // If we are in Mock Mode, we won't have accountResource, so we just show the generated reply locally.
      if (!accountResource || !locationResource) {
        setReviews(prev => prev.map(r => r.id === id ? { 
          ...r, 
          replied: true,
          rawReply: { comment: data.reply }
        } : r));
        showToast("🤖 AI Reply generated! (Mock Mode - Not posted to Google)");
        return;
      }

      // 2. Post to Google (Live Mode Only)
      showToast("AI Generated Reply. Posting to Google...");
      
      const postRes = await fetch('/api/post-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName: accountResource,
          locationName: locationResource,
          reviewId: reviewToReply.id,
          replyText: data.reply
        })
      });

      const postData = await postRes.json();

      if (postData.error) {
        showToast(`❌ Google Error: ${postData.error}`);
      } else {
        setReviews(prev => prev.map(r => r.id === id ? { 
          ...r, 
          replied: true,
          rawReply: { comment: data.reply }
        } : r));
        showToast("✅ Successfully posted reply to Google!");
      }
    } catch (err) {
      showToast("❌ Failed to process reply");
    } finally {
      setReplyingId(null);
    }
  };

  const unrepliedCount = reviews.filter(r => !r.replied).length;

  return {
    reviews,
    locationName,
    isLoadingReviews,
    apiError,
    isReplyingBulk,
    replyingId,
    progress,
    toastMessage,
    handleBulkReply,
    handleSingleReply,
    unrepliedCount
  };
}
