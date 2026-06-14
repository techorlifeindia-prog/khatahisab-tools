'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Rocket, Search, Store, MapPin, CheckCircle2, Loader2, BarChart3, MessageSquare, Image as ImageIcon, QrCode, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Scan Steps Logic
const SCAN_STEPS = [
  { id: 'details', text: 'Business details extract kar rahe hain...' },
  { id: 'seo', text: 'Local SEO keywords check kar rahe hain...' },
  { id: 'competitors', text: 'Aas-paas ke competitors analyse kar rahe hain...' },
  { id: 'reviews', text: 'Customer reviews & ratings padh rahe hain...' },
  { id: 'photos', text: 'Photos & Google Posts scan kar rahe hain...' },
  { id: 'finalize', text: 'Final AI Report taiyaar kar rahe hain...' },
];

export default function BusinessBooster() {
  const [step, setStep] = useState<'input' | 'scanning' | 'dashboard'>('input');

  // Input Form States
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [location, setLocation] = useState('');

  // Autocomplete States
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name: string, category: string, location: string }[]>([]);

  // Scanning States
  const [currentScanStep, setCurrentScanStep] = useState(0);

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<'report' | 'review' | 'post' | 'qr'>('report');

  // Google Places Data
  const [googlePhotoUrl, setGooglePhotoUrl] = useState<string | null>(null);
  const [googleRating, setGoogleRating] = useState<number>(0);
  const [googleReviewCount, setGoogleReviewCount] = useState<number>(0);
  const [profileScore, setProfileScore] = useState<number>(85);
  const [issuesFound, setIssuesFound] = useState<number>(8);
  const [googleAddress, setGoogleAddress] = useState<string>('');

  // Review Replier States
  const [reviewText, setReviewText] = useState('');
  const [reviewTone, setReviewTone] = useState('Professional');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');

  // Post Generator States
  const [postPrompt, setPostPrompt] = useState('');
  const [postPlatform, setPostPlatform] = useState('Instagram');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');

  // QR Poster States
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [qrDesign, setQrDesign] = useState('Classic');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [generatedQrUrl, setGeneratedQrUrl] = useState('');

  useEffect(() => {
    if (businessName.length < 3) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowSuggestions(true);

      try {
        const response = await fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: businessName, action: 'autocomplete' })
        });
        const data = await response.json();

        if (data && data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        } else {
          // Fallback if no exact match found
          setSuggestions([
            { name: businessName, category: 'Local Business', location: 'India' }
          ]);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [businessName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value);
  };

  const selectSuggestion = (suggestion: { name: string, category: string, location: string }) => {
    setBusinessName(suggestion.name);
    setBusinessCategory(suggestion.category);
    setLocation(suggestion.location);
    setShowSuggestions(false);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setLocation('Locating...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.state_district || 'India';
            setLocation(city);
          } catch (e) {
            setLocation('');
          }
        },
        (error) => {
          setLocation('');
          console.error("Error getting location", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const startScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !businessCategory) return;

    setStep('scanning');
    setCurrentScanStep(0);

    // Fetch Google Places data asynchronously
    fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `${businessName} ${location}` })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          if (data.photoUrl) setGooglePhotoUrl(data.photoUrl);
          if (data.rating) setGoogleRating(data.rating);
          if (data.userRatingCount) setGoogleReviewCount(data.userRatingCount);
          if (data.profileScore) setProfileScore(data.profileScore);
          if (data.issuesFound) setIssuesFound(data.issuesFound);
          
          setGoogleAddress(data.address);
        }
      })
      .catch(err => console.error("Error fetching places data:", err));

    // Simulate the scanning process
    let currentStep = 0;
    const scanInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep < SCAN_STEPS.length) {
        setCurrentScanStep(currentStep);
      } else {
        clearInterval(scanInterval);
        setTimeout(() => setStep('dashboard'), 1000); // Move to dashboard after last step
      }
    }, 1800); // 1.8 seconds per step
  };

  const generateReply = async () => {
    if (!reviewText) return;
    setIsGeneratingReply(true);
    setGeneratedReply('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          prompt: reviewText,
          tone: reviewTone,
          businessName: businessName || 'Local Business',
          location: location || 'India'
        })
      });
      const data = await res.json();
      if (data.result) {
        setGeneratedReply(data.result);
      } else {
        setGeneratedReply('Failed to generate reply. Please try again.');
      }
    } catch (e) {
      setGeneratedReply('Error connecting to AI. Please try again.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedReply) return;
    navigator.clipboard.writeText(generatedReply);
    alert('Reply copied to clipboard!');
  };

  const generatePost = async () => {
    if (!postPrompt) return;
    setIsGeneratingPost(true);
    setGeneratedPost('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post',
          prompt: postPrompt,
          platform: postPlatform,
          businessName: businessName || 'Local Business',
          location: location || 'India'
        })
      });
      const data = await res.json();
      if (data.result) {
        setGeneratedPost(data.result);
      } else {
        setGeneratedPost('Failed to generate post. Please try again.');
      }
    } catch (e) {
      setGeneratedPost('Error connecting to AI. Please try again.');
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const copyPostToClipboard = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    alert('Post copied to clipboard!');
  };

  const generateQr = () => {
    if (!googleReviewLink) return;
    setIsGeneratingQr(true);

    // Use goqr.me API for free, quick QR generation
    setTimeout(() => {
      // Basic validation for URL
      let finalLink = googleReviewLink;
      if (!finalLink.startsWith('http')) {
        finalLink = 'https://' + finalLink;
      }

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(finalLink)}&margin=10`;
      setGeneratedQrUrl(qrApiUrl);
      setIsGeneratingQr(false);
    }, 1500);
  };

  const downloadQrPoster = () => {
    if (!generatedQrUrl) return;
    // In a real app, we would use canvas to draw the full poster and download it.
    // For now, we will just open the QR image in a new tab.
    window.open(generatedQrUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[100%] mx-auto px-2">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-1.5 rounded-lg text-white shadow-sm shadow-blue-200">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight">AI Business Booster <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-black ml-1">Free</span></h1>
                  <p className="text-[10px] text-slate-500 font-medium">Grow Local SEO & Google Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className={`mx-auto transition-all duration-500 ${step === 'dashboard' ? 'max-w-[100%] p-1' : 'max-w-3xl px-2 sm:px-4 py-4 md:py-8'}`}>

        {/* STEP 1: INPUT FORM */}
        {step === 'input' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3 relative">
                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
                <TrendingUp className="w-6 h-6 relative z-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight">Supercharge Your Local Business</h2>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Get an instant AI audit, 1-click review replies, and auto-generated social posts. Rank #1 on Google.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

              <form onSubmit={startScan} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Business Name <span className="text-red-500">*</span></label>
                  <div className="relative z-20">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      {isSearching ? (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      ) : (
                        <Store className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={handleNameChange}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // delay to allow click
                      onFocus={() => businessName.length > 2 && setShowSuggestions(true)}
                      className="block w-full pl-10 pr-3 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="e.g. Sharma Sweets"
                      autoComplete="off"
                    />

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Google Search Results
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                          {suggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              onClick={() => selectSuggestion(suggestion)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3"
                            >
                              <div className="bg-slate-100 p-2 rounded-lg mt-0.5 text-slate-500 shrink-0">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-800">{suggestion.name}</h4>
                                <p className="text-xs text-slate-500">{suggestion.category} • {suggestion.location}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Business Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="e.g. Sweet Shop, Plumber, Doctor..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">City / Location <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full pl-10 pr-24 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="e.g. Jaipur, Rajasthan"
                    />
                    <button
                      type="button"
                      onClick={detectLocation}
                      className="absolute inset-y-1.5 right-1.5 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center"
                    >
                      Detect
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] text-lg"
                >
                  <Rocket className="w-5 h-5" /> Start AI Audit
                </button>
              </form>
            </div>

            {/* Features Preview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3"><MessageSquare className="w-5 h-5" /></div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">AI Review Replier</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Auto-generate professional replies to 1-star and 5-star Google reviews instantly.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3"><ImageIcon className="w-5 h-5" /></div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">AI Post Generator</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Create engaging social media posts with emojis and hashtags automatically.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3"><QrCode className="w-5 h-5" /></div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Review QR Poster</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Generate beautiful QR code posters for your shop counter to get more reviews.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {step === 'scanning' && (
          <div className="animate-in fade-in duration-500 flex flex-col items-center py-10">
            {/* Hacker-style Radar / Pulse Animation */}
            <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-[ping_3s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border-2 border-indigo-500/40 animate-[ping_2s_linear_infinite]" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 rounded-full border-2 border-purple-500/50 animate-[ping_1.5s_linear_infinite]" style={{ animationDelay: '1s' }}></div>

              <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.5)] flex items-center justify-center border-4 border-white">
                <Store className="w-10 h-10 text-white" />
              </div>

              {/* Scanning Laser Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 animate-[scan_2s_ease-in-out_infinite_alternate]"></div>
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-2">Analyzing <span className="text-blue-600">{businessName}</span></h2>
            <p className="text-slate-500 text-sm mb-10 font-medium bg-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Please wait, AI is working...
            </p>

            {/* Stepper */}
            <div className="w-full max-w-md bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
              <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-slate-100 z-0 hidden sm:block"></div>

              <div className="space-y-6 relative z-10">
                {SCAN_STEPS.map((scanStep, index) => {
                  const isCompleted = index < currentScanStep;
                  const isCurrent = index === currentScanStep;
                  const isPending = index > currentScanStep;

                  return (
                    <div key={scanStep.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border-2 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                          isCurrent ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                            'bg-white border-slate-200 text-slate-300'
                        }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                          isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> :
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>}
                      </div>
                      <span className={`text-sm font-semibold transition-colors duration-300 ${isCompleted ? 'text-slate-700' :
                          isCurrent ? 'text-blue-600' :
                            'text-slate-400'
                        }`}>
                        {scanStep.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DASHBOARD */}
        {step === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">

              {/* Dashboard Sidebar */}
              <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-2 shrink-0">
                <div className="mb-6">
                  <h3 className="font-black text-slate-800 text-lg truncate">{businessName}</h3>
                  <p className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded inline-block mt-1">Audit Score: {profileScore}/100</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors ${activeTab === 'report' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <BarChart3 className="w-4 h-4" /> Audit Report
                  </button>
                  <button
                    onClick={() => setActiveTab('review')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors ${activeTab === 'review' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <MessageSquare className="w-4 h-4" /> Review Replier
                  </button>
                  <button
                    onClick={() => setActiveTab('post')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors ${activeTab === 'post' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <ImageIcon className="w-4 h-4" /> Post Generator
                  </button>
                  <button
                    onClick={() => setActiveTab('qr')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors ${activeTab === 'qr' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <QrCode className="w-4 h-4" /> QR Poster
                  </button>
                </nav>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-2 md:p-3 bg-white md:max-h-[800px] md:overflow-y-auto custom-scrollbar">

                {activeTab === 'report' && (
                  <div className="animate-in fade-in duration-300">
                    {/* Business Profile Card */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-8 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-800 text-white text-3xl font-black rounded-full flex items-center justify-center shrink-0 border-4 border-slate-100 shadow-sm uppercase overflow-hidden">
                          {googlePhotoUrl ? <img src={googlePhotoUrl} alt={businessName} className="w-full h-full object-cover" /> : (businessName ? businessName.charAt(0) : <Store className="w-8 h-8 text-slate-400" />)}
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-800 capitalize">{businessName || 'Your Business'}</h2>
                          <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">{googleAddress || location || 'Your Full Address Here...'}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-sm font-bold text-slate-700">{googleRating || 4.8}</span>
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="text-xs text-slate-500 ml-1">({googleReviewCount || 42} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setStep('input')} className="text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0 sm:mt-2">
                        Business badlein
                      </button>
                    </div>

                    {/* Report Header */}
                    <div className="text-center md:text-left mb-8">
                      <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Report Ready • {issuesFound} Issues Found
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 leading-tight">
                        <span className="text-blue-600">{businessName || 'Your Business'}</span> is losing customers to 20 competitors on Google.
                      </h2>
                      <p className="text-slate-500 text-sm md:text-base">
                        Right now, when people search for "{businessCategory || 'your services'}" near {location || 'your area'}, competitors are showing up first. Start fixing these issues to rank #1.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-slate-800 mb-1">20</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Competitors Ahead</div>
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-red-600 mb-1">{issuesFound}</div>
                        <div className="text-xs font-semibold text-red-500 uppercase tracking-wider">Issues Hurting Rank</div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                        <div className="text-3xl font-black text-emerald-600 mb-1">{profileScore}%</div>
                        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Profile Complete</div>
                      </div>
                    </div>

                    {/* Competitors List */}
                    <div className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-800">Who is ranking above you?</h3>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                            <tr>
                              <th className="px-4 py-3">Business</th>
                              <th className="px-4 py-3 text-center">Rating</th>
                              <th className="px-4 py-3 text-center">Reviews</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr className="bg-white">
                              <td className="px-4 py-3 font-bold text-slate-700">Top {businessCategory || 'Competitor'} 1</td>
                              <td className="px-4 py-3 text-center text-amber-500 font-bold">5.0 ★</td>
                              <td className="px-4 py-3 text-center text-emerald-600 font-semibold">124</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="px-4 py-3 font-bold text-slate-700">Premium {businessCategory || 'Competitor'} 2</td>
                              <td className="px-4 py-3 text-center text-amber-500 font-bold">4.9 ★</td>
                              <td className="px-4 py-3 text-center text-emerald-600 font-semibold">89</td>
                            </tr>
                            <tr className="bg-blue-50/50 border-l-4 border-l-blue-500">
                              <td className="px-4 py-3 font-black text-blue-700">{businessName || 'Your Business'}</td>
                              <td className="px-4 py-3 text-center font-bold text-slate-600">4.1 ★</td>
                              <td className="px-4 py-3 text-center font-bold text-slate-600">12</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Actionable Issues */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-slate-800">Why are you not ranking?</h3>
                      </div>

                      <div className="space-y-4">
                        {/* Issue 1 */}
                        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1">
                                <span>❌</span> Unanswered Reviews
                              </div>
                              <p className="text-slate-600 text-sm">You have 7 reviews that haven't been replied to. Google prefers active profiles.</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('review')}
                              className="shrink-0 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
                            >
                              Fix with AI Replier
                            </button>
                          </div>
                        </div>

                        {/* Issue 2 */}
                        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-1">
                                <span>⚠️</span> No Recent Posts
                              </div>
                              <p className="text-slate-600 text-sm">You haven't posted updates in the last 30 days. Regular posts boost local SEO.</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('post')}
                              className="shrink-0 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
                            >
                              Generate AI Post
                            </button>
                          </div>
                        </div>

                        {/* Issue 3 */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-1">
                                <span>📉</span> Low Review Volume
                              </div>
                              <p className="text-slate-600 text-sm">You are getting less than 0.5 new reviews per week. Top competitors get 3+.</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('qr')}
                              className="shrink-0 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
                            >
                              Get QR Poster
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'review' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MessageSquare className="w-5 h-5" /></div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">1-Click Review Replier</h2>
                        <p className="text-sm text-slate-500 font-medium">Paste a customer review and let AI write the perfect reply.</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Customer's Review</label>
                        <textarea
                          rows={4}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="block w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all text-sm resize-none"
                          placeholder="Paste the review here... (e.g. 'The food was amazing but the service was a bit slow.')"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Reply Tone</label>
                        <div className="flex flex-wrap gap-2">
                          {['Professional', 'Friendly', 'Apologetic', 'Grateful'].map((tone) => (
                            <button
                              key={tone}
                              onClick={() => setReviewTone(tone)}
                              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${reviewTone === tone
                                  ? 'bg-slate-800 text-white shadow-md'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {tone}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={generateReply}
                        disabled={!reviewText || isGeneratingReply}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                      >
                        {isGeneratingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                        {isGeneratingReply ? 'Generating Reply...' : 'Generate AI Reply'}
                      </button>

                      {generatedReply && (
                        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl relative animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-2">AI Generated Reply</h4>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{generatedReply}</p>

                          <button
                            onClick={copyToClipboard}
                            className="mt-4 text-xs font-bold bg-white text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
                          >
                            Copy to Clipboard
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'post' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ImageIcon className="w-5 h-5" /></div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">AI Social Post Generator</h2>
                        <p className="text-sm text-slate-500 font-medium">Just write a short idea, and AI will create a full post with emojis & hashtags.</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">What's new in your business?</label>
                        <textarea
                          rows={3}
                          value={postPrompt}
                          onChange={(e) => setPostPrompt(e.target.value)}
                          className="block w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-slate-50 focus:bg-white transition-all text-sm resize-none"
                          placeholder="e.g. 'We just launched a 50% off Diwali sale on all items!'"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Platform</label>
                        <div className="flex flex-wrap gap-2">
                          {['Instagram', 'Google Business'].map((platform) => (
                            <button
                              key={platform}
                              onClick={() => setPostPlatform(platform)}
                              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${postPlatform === platform
                                  ? 'bg-slate-800 text-white shadow-md'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={generatePost}
                        disabled={!postPrompt || isGeneratingPost}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                      >
                        {isGeneratingPost ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                        {isGeneratingPost ? 'Generating Post...' : 'Generate AI Post'}
                      </button>

                      {generatedPost && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl relative animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2">AI Generated Post</h4>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap font-medium leading-relaxed">{generatedPost}</p>

                          <button
                            onClick={copyPostToClipboard}
                            className="mt-4 text-xs font-bold bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors shadow-sm"
                          >
                            Copy to Clipboard
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'qr' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><QrCode className="w-5 h-5" /></div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">Google Review QR Poster</h2>
                        <p className="text-sm text-slate-500 font-medium">Create a beautiful printable poster to get more 5-star reviews.</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Google Review Link</label>
                        <input
                          type="url"
                          value={googleReviewLink}
                          onChange={(e) => setGoogleReviewLink(e.target.value)}
                          className="block w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all text-sm"
                          placeholder="e.g. https://g.page/r/YOUR_ID/review"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Poster Design</label>
                        <div className="flex flex-wrap gap-2">
                          {['Classic', 'Modern', 'Playful', 'Minimalist'].map((design) => (
                            <button
                              key={design}
                              onClick={() => setQrDesign(design)}
                              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${qrDesign === design
                                  ? 'bg-slate-800 text-white shadow-md'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {design}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={generateQr}
                        disabled={!googleReviewLink || isGeneratingQr}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95"
                      >
                        {isGeneratingQr ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                        {isGeneratingQr ? 'Generating Poster...' : 'Generate Poster'}
                      </button>

                      {generatedQrUrl && (
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
                          <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 flex flex-col items-center text-center max-w-sm mx-auto">
                            <h3 className="text-2xl font-black text-slate-800 mb-1">{businessName || 'Our Business'}</h3>
                            <p className="text-emerald-700 font-bold mb-6 uppercase tracking-widest text-sm">Scan to Review Us!</p>

                            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-emerald-100">
                              <img src={generatedQrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                            </div>

                            <div className="flex text-amber-400 mb-6 gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <svg key={star} className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>

                            <button
                              onClick={downloadQrPoster}
                              className="w-full text-sm font-bold bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                            >
                              Download QR Poster
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => setStep('input')} className="text-sm font-bold text-slate-400 hover:text-slate-600 underline">Start New Audit</button>
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
