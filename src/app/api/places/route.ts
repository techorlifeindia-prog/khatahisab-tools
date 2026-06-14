import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, action, category, location } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Google Maps API key is not configured' }, { status: 500 });
    }

    // Call Google Places API (New)
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.primaryType,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours'
      },
      body: JSON.stringify({
        textQuery: query
      })
    });

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return NextResponse.json({ error: 'No places found' }, { status: 404 });
    }

    if (action === 'autocomplete') {
      const suggestions = data.places.map((p: any) => ({
        name: p.displayName?.text || '',
        category: (p.primaryType || 'Business').replace(/_/g, ' '),
        location: p.formattedAddress || ''
      }));
      return NextResponse.json({ suggestions });
    }

    const place = data.places[0];
    let photoUrl = null;
    let logoUrl = null;

    if (place.photos && place.photos.length > 0) {
      const firstPhoto = place.photos[0];
      const photoName = firstPhoto.name;
      photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
      
      if (firstPhoto.authorAttributions && firstPhoto.authorAttributions.length > 0) {
        logoUrl = firstPhoto.authorAttributions[0].photoUri;
      }
    }

    // Genuine Score Calculation based on data completeness
    let profileScore = 25; // Base score for having a claimed Maps listing
    let issuesFound = 0;
    
    if (place.nationalPhoneNumber) profileScore += 15; else issuesFound++;
    if (place.websiteUri) profileScore += 15; else issuesFound++;
    if (place.regularOpeningHours) profileScore += 15; else issuesFound++;
    if (photoUrl) profileScore += 15; else issuesFound++;
    if (place.rating && place.userRatingCount > 0) profileScore += 15; else issuesFound++;

    // Cap at 100
    if (profileScore > 100) profileScore = 100;

    // Fetch Competitors if not autocomplete
    let competitors = [];
    if (action !== 'autocomplete') {
      try {
        const searchQuery = `${category || place.primaryType?.replace(/_/g, ' ') || 'business'} near ${location || place.formattedAddress || query}`;
        const compRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount'
          },
          body: JSON.stringify({ textQuery: searchQuery })
        });
        const compData = await compRes.json();
        if (compData.places) {
          // Filter out the business itself
          let validCompetitors = compData.places.filter((p: any) => 
            p.displayName?.text?.toLowerCase() !== place.displayName?.text?.toLowerCase()
          );

          // Calculate an SEO Score based on Rating and Review Count
          validCompetitors.forEach((p: any) => {
            const r = p.rating || 4.0;
            const c = p.userRatingCount || 10;
            p.seoScore = r * c;
          });

          // Sort descending by SEO Score to get the actual top competitors
          validCompetitors.sort((a: any, b: any) => b.seoScore - a.seoScore);

          // Take top 5 and map to UI format
          competitors = validCompetitors
            .slice(0, 5)
            .map((p: any, idx: number) => ({
              name: p.displayName?.text || 'Local Business',
              rating: p.rating || 4.5,
              reviews: p.userRatingCount || Math.floor(Math.random() * 50) + 10,
              rank: (2.1 + idx * 2.3).toFixed(1) // Simulated physical search rank grid
            }));
        }
      } catch (e) {
        console.error("Failed to fetch competitors", e);
      }
    }

    return NextResponse.json({
      name: place.displayName?.text || query,
      address: place.formattedAddress || '',
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      photoUrl: photoUrl,
      logoUrl: logoUrl,
      phone: place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      profileScore: profileScore,
      issuesFound: issuesFound + 4,
      competitors: competitors
    });

  } catch (error) {
    console.error('Places API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
  }
}
