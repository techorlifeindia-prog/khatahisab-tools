// [TL-REVIEWS-API-01: Reviews API]
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// PROFESSIONAL DEV MODE: Set to false once Google API Quota is approved
const MOCK_MODE = true;

const MOCK_REVIEWS_DATA = [
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

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = token.accessToken as string;

    if (MOCK_MODE) {
      // Simulate network delay for a realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ 
        location: "Chamunda industries (Mock Mode)",
        reviews: MOCK_REVIEWS_DATA 
      });
    }

    // 1. Fetch Accounts
    const accountRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const accountData = await accountRes.json();

    if (accountData.error) {
      return NextResponse.json({ error: `Google API Error: ${accountData.error.message}` }, { status: 403 });
    }

    if (!accountData.accounts || accountData.accounts.length === 0) {
      return NextResponse.json({ error: "No Google Business Accounts found for this email." }, { status: 404 });
    }

    // Get the first account (usually the main user account)
    const accountName = accountData.accounts[0].name; // e.g. "accounts/12345"

    // 2. Fetch Locations
    const locationRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const locationData = await locationRes.json();

    if (!locationData.locations || locationData.locations.length === 0) {
      return NextResponse.json({ error: "No locations found for this account." }, { status: 404 });
    }

    // Use the first location
    const locationName = locationData.locations[0].name; // e.g. "locations/67890"
    const locationTitle = locationData.locations[0].title;

    // 3. Fetch Reviews (using v4 API as it's the stable one for reviews)
    const reviewsRes = await fetch(`https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const reviewsData = await reviewsRes.json();

    // 4. Format Reviews
    const reviews = (reviewsData.reviews || []).map((review: any) => {
      return {
        id: review.reviewId,
        author: review.reviewer.displayName,
        rating: review.starRating === 'FIVE' ? 5 : review.starRating === 'FOUR' ? 4 : review.starRating === 'THREE' ? 3 : review.starRating === 'TWO' ? 2 : 1,
        text: review.comment || "",
        time: new Date(review.createTime).toLocaleDateString(), 
        replied: !!review.reviewReply,
        rawReply: review.reviewReply || null
      };
    });

    return NextResponse.json({ 
      location: locationTitle,
      accountName,
      locationName,
      reviews 
    });
  } catch (error) {
    console.error("Reviews API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
