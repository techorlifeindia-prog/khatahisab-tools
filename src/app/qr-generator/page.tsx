'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link2, Wifi, Mail, Contact, MessageSquare, MapPin, Download, Palette, Image as ImageIcon, Settings, ArrowLeft, QrCode, Layers, FileJson } from 'lucide-react';
import Link from 'next/link';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel
} from 'qr-code-styling';

type Mode = 'single' | 'bulk';
type QrType = 'url' | 'wifi' | 'email' | 'vcard' | 'whatsapp' | 'location';

export default function QrGenerator() {
  const [mode, setMode] = useState<Mode>('single');
  const [activeTab, setActiveTab] = useState<QrType>('url');
  
  // Data States
  const [url, setUrl] = useState('https://m3bharat.com');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [vcName, setVcName] = useState('');
  const [vcPhone, setVcPhone] = useState('');
  const [vcEmail, setVcEmail] = useState('');
  const [vcCompany, setVcCompany] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [locLat, setLocLat] = useState('');
  const [locLng, setLocLng] = useState('');

  // Bulk State
  const [bulkData, setBulkData] = useState('https://m3bharat.com\nhttps://google.com\nhttps://youtube.com');
  const [isBulking, setIsBulking] = useState(false);

  // Dynamic QR State
  const [isDynamic, setIsDynamic] = useState(false);
  const [isGeneratingDynamic, setIsGeneratingDynamic] = useState(false);
  const [dynamicShortUrl, setDynamicShortUrl] = useState('');

  // Design States
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('Q');
  const [dotsType, setDotsType] = useState<DotType>('rounded');
  const [cornersSquareType, setCornersSquareType] = useState<CornerSquareType>('extra-rounded');
  const [cornersDotType, setCornersDotType] = useState<CornerDotType>('dot');
  
  // Logo State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.2); // 20% of QR size

  const [qrValue, setQrValue] = useState('https://m3bharat.com');
  const qrRef = useRef<HTMLDivElement>(null);

  // Initialize qrCode generator instance
  const qrCode = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new QRCodeStyling({
        width: 280,
        height: 280,
        type: "svg",
        data: "https://m3bharat.com",
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10
        }
      });
    }
    return null;
  }, []);

  // Update Data based on Tab
  useEffect(() => {
    let val = '';
    switch (activeTab) {
      case 'url': val = url || ' '; break;
      case 'wifi': val = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`; break;
      case 'email': val = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`; break;
      case 'vcard': val = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcCompany}\nEND:VCARD`; break;
      case 'whatsapp': val = `https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`; break;
      case 'location': val = `geo:${locLat},${locLng}`; break;
    }
    setQrValue(val);
  }, [activeTab, url, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, emailTo, emailSubject, emailBody, vcName, vcPhone, vcEmail, vcCompany, waPhone, waMessage, locLat, locLng]);

  // Apply Styling Updates
  useEffect(() => {
    if (qrCode) {
      // If Dynamic is enabled and a short URL exists, use that. Otherwise use raw value.
      const finalData = isDynamic && dynamicShortUrl ? dynamicShortUrl : (qrValue || ' ');
      
      qrCode.update({
        data: finalData,
        dotsOptions: { color: fgColor, type: dotsType },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: fgColor, type: cornersSquareType },
        cornersDotOptions: { color: fgColor, type: cornersDotType },
        qrOptions: { errorCorrectionLevel },
        image: logoUrl || undefined,
        imageOptions: { imageSize: logoSize, margin: 5, crossOrigin: "anonymous" }
      });
    }
  }, [qrCode, qrValue, fgColor, bgColor, dotsType, cornersSquareType, cornersDotType, errorCorrectionLevel, logoUrl, logoSize, isDynamic, dynamicShortUrl]);

  // Mount QR to DOM
  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode, qrRef]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
        setErrorCorrectionLevel('H');
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSingle = async (extension: 'png' | 'svg') => {
    if (qrCode) {
      if (isDynamic && !dynamicShortUrl) {
        alert("Please generate the Dynamic Link first before downloading.");
        return;
      }
      await qrCode.download({ name: `m3bharat-qr-${activeTab}`, extension });
    }
  };

  const generateDynamicLink = async () => {
    if (!qrValue.trim()) return;
    setIsGeneratingDynamic(true);
    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl: qrValue, type: activeTab })
      });
      const data = await response.json();
      if (data.error) {
        alert("Error generating dynamic link: " + data.error);
        // Fallback for user lacking DB setup
        if (data.error.includes('fetch')) {
           alert("Please setup Supabase keys in .env.local first.");
        }
      } else if (data.shortUrl) {
        setDynamicShortUrl(data.shortUrl);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to server.");
    } finally {
      setIsGeneratingDynamic(false);
    }
  };

  const downloadBulk = async () => {
    if (!bulkData.trim()) return;
    setIsBulking(true);
    try {
      const lines = bulkData.split('\n').filter(l => l.trim().length > 0);
      const zip = new JSZip();
      const folder = zip.folder("m3bharat-bulk-qrs");

      // We create a temporary QR generator for high-res output
      const bulkQr = new QRCodeStyling({
        width: 1024,
        height: 1024,
        type: "canvas",
        dotsOptions: { color: fgColor, type: dotsType },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: fgColor, type: cornersSquareType },
        cornersDotOptions: { color: fgColor, type: cornersDotType },
        qrOptions: { errorCorrectionLevel },
        image: logoUrl || undefined,
        imageOptions: { imageSize: logoSize, margin: 10, crossOrigin: "anonymous" }
      });

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        bulkQr.update({ data: line });
        const blob = await bulkQr.getRawData("png");
        if (blob) {
          // Sanitized filename
          let safeName = line.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
          if (!safeName) safeName = `qr_${i}`;
          folder?.file(`${safeName}.png`, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "m3bharat_bulk_qrs.zip");
    } catch (e) {
      console.error(e);
      alert("Failed to generate bulk QR codes.");
    } finally {
      setIsBulking(false);
    }
  };

  const renderTabIcon = (type: QrType) => {
    switch (type) {
      case 'url': return <Link2 className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'vcard': return <Contact className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-500 p-1.5 rounded-lg text-white shadow-sm shadow-indigo-200">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight">Smart QR Generator <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">PRO</span></h1>
                  <p className="text-[10px] text-slate-500 font-medium">Create beautiful custom QR codes</p>
                </div>
              </div>
            </div>
            {/* Mode Switcher */}
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button onClick={() => setMode('single')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${mode === 'single' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <QrCode className="w-3.5 h-3.5" /> Single
              </button>
              <button onClick={() => setMode('bulk')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${mode === 'bulk' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Layers className="w-3.5 h-3.5" /> Bulk Export
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Mode Switcher */}
      <div className="sm:hidden p-3 bg-white border-b border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button onClick={() => setMode('single')} className={`flex-1 justify-center px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${mode === 'single' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
            <QrCode className="w-3.5 h-3.5" /> Single
          </button>
          <button onClick={() => setMode('bulk')} className={`flex-1 justify-center px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${mode === 'bulk' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
            <Layers className="w-3.5 h-3.5" /> Bulk
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Data & Design Input */}
          <div className="lg:col-span-7 space-y-3">
            
            {mode === 'single' ? (
              <>
                {/* Type Selector */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Select QR Type</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {(['url', 'wifi', 'email', 'vcard', 'whatsapp', 'location'] as QrType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1 ${
                          activeTab === type 
                            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm' 
                            : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {renderTabIcon(type)}
                        <span className="text-[10px] font-bold capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Forms */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                    {renderTabIcon(activeTab)} Enter {activeTab} Details
                  </h2>
                  <div className="space-y-3">
                    {activeTab === 'url' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Website URL or Text</label>
                        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                      </div>
                    )}
                    {activeTab === 'wifi' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Network Name (SSID)</label>
                          <input type="text" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} placeholder="My Wi-Fi Network" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                          <input type="text" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Encryption</label>
                          <select value={wifiEncryption} onChange={e => setWifiEncryption(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                            <option value="WPA">WPA/WPA2/WPA3</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {activeTab === 'email' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Send To</label>
                          <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="hello@example.com" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                          <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Inquiry" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Message Body</label>
                          <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={2} placeholder="Write your message here..." className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"></textarea>
                        </div>
                      </div>
                    )}
                    {activeTab === 'vcard' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                          <input type="text" value={vcName} onChange={e => setVcName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                          <input type="text" value={vcCompany} onChange={e => setVcCompany(e.target.value)} placeholder="Acme Inc." className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                          <input type="tel" value={vcPhone} onChange={e => setVcPhone(e.target.value)} placeholder="+1 234 567 890" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                          <input type="email" value={vcEmail} onChange={e => setVcEmail(e.target.value)} placeholder="john@acme.com" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                      </div>
                    )}
                    {activeTab === 'whatsapp' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                          <input type="tel" value={waPhone} onChange={e => setWaPhone(e.target.value)} placeholder="+919876543210" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Pre-filled Message</label>
                          <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)} rows={2} placeholder="Hi, I'm interested..." className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"></textarea>
                        </div>
                      </div>
                    )}
                    {activeTab === 'location' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
                          <input type="text" value={locLat} onChange={e => setLocLat(e.target.value)} placeholder="40.7128" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
                          <input type="text" value={locLng} onChange={e => setLocLng(e.target.value)} placeholder="-74.0060" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Bulk Generator Mode
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Bulk Generator</h2>
                    <p className="text-[11px] text-slate-500 font-medium">Generate up to 1000 QR codes instantly</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between">
                    <span>Paste URLs or Data (One per line)</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">{bulkData.split('\n').filter(l => l.trim()).length} Items</span>
                  </label>
                  <textarea 
                    value={bulkData} 
                    onChange={e => setBulkData(e.target.value)} 
                    rows={6} 
                    placeholder="https://google.com&#10;https://youtube.com&#10;https://facebook.com" 
                    className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm leading-relaxed resize-none custom-scrollbar bg-slate-50"
                  ></textarea>
                </div>
                <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                  <h4 className="text-[11px] font-bold text-indigo-800 mb-0.5 flex items-center gap-1.5"><FileJson className="w-3.5 h-3.5" /> Pro Tip</h4>
                  <p className="text-[10px] text-indigo-600 font-medium leading-snug">Customize the design below. The design will be applied to ALL generated QR codes in the ZIP file.</p>
                </div>
              </div>
            )}

            {/* Customization Panel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1 border-b border-slate-100 pb-2">
                <Palette className="w-4 h-4 text-indigo-500" /> Advanced Design
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Colors</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">Foreground</div>
                      <div className="flex items-center gap-1.5">
                        <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                        <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded-md border border-slate-200 font-mono uppercase bg-white" />
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">Background</div>
                      <div className="flex items-center gap-1.5">
                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                        <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 px-2 py-1 text-xs rounded-md border border-slate-200 font-mono uppercase bg-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Pattern Style (Dots)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'] as DotType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setDotsType(type)}
                        className={`py-1.5 text-[10px] font-bold rounded-md border-2 transition-all capitalize ${dotsType === type ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Corner Style</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['square', 'dot', 'extra-rounded'] as CornerSquareType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setCornersSquareType(type)}
                          className={`py-1.5 text-[10px] font-bold rounded-md border-2 transition-all capitalize ${cornersSquareType === type ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                          {type.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Corner Center Dot</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['square', 'dot'] as CornerDotType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setCornersDotType(type)}
                          className={`py-1.5 text-[10px] font-bold rounded-md border-2 transition-all capitalize ${cornersDotType === type ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-700 mb-2 flex justify-between items-center">
                    Center Logo
                    <span className="text-[9px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">Error Correction is auto-adjusted</span>
                  </label>
                  {!logoUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-center gap-2">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <p className="text-[11px] font-bold text-slate-600">Click to upload (PNG/JPG)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain bg-white rounded flex-shrink-0 p-0.5 border border-slate-200 shadow-sm" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Scale</span>
                          <span className="text-[10px] font-bold text-indigo-600">{Math.round(logoSize * 100)}%</span>
                        </div>
                        <input 
                          type="range" min="0.1" max="0.3" step="0.01" 
                          value={logoSize} onChange={(e) => setLogoSize(parseFloat(e.target.value))} 
                          className="w-full accent-indigo-500 h-1" 
                        />
                      </div>
                      <button onClick={() => setLogoUrl(null)} className="p-1.5 text-red-500 hover:bg-red-50 rounded font-bold text-[10px] transition-colors">REMOVE</button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                    <div>
                      <h4 className="text-[12px] font-bold text-indigo-900">Enable Dynamic QR</h4>
                      <p className="text-[10px] text-indigo-600 font-medium leading-snug">Change the destination link anytime after printing.</p>
                    </div>
                    <div className="relative inline-flex items-center">
                      <input type="checkbox" className="sr-only peer" checked={isDynamic} onChange={() => { setIsDynamic(!isDynamic); setDynamicShortUrl(''); }} />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                  </label>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Preview & Export */}
          <div className="lg:col-span-5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-500" /> Design Preview
              </h2>

              <div className="flex flex-col items-center">
                <div className="p-4 bg-slate-50 rounded-2xl shadow-[inset_0_1px_5px_rgba(0,0,0,0.02)] border border-slate-100 mb-5 flex justify-center items-center relative min-h-[260px] w-full">
                  {/* Dynamic QR Injection Point */}
                  <div ref={qrRef} className="rounded-xl shadow-sm overflow-hidden bg-white ring-4 ring-white"></div>
                </div>

                <div className="w-full space-y-2.5">
                  {mode === 'single' ? (
                    <>
                      {isDynamic && !dynamicShortUrl ? (
                        <button 
                          onClick={generateDynamicLink} 
                          disabled={isGeneratingDynamic}
                          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md shadow-emerald-200 transition-all active:scale-95 text-sm"
                        >
                          {isGeneratingDynamic ? <Settings className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                          {isGeneratingDynamic ? 'Creating Link...' : 'Generate Dynamic Link'}
                        </button>
                      ) : (
                        <>
                          <button onClick={() => downloadSingle('png')} className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-95 text-sm">
                            <Download className="w-4 h-4" /> Download HD PNG
                          </button>
                          <button onClick={() => downloadSingle('svg')} className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-100 font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all active:scale-95 text-sm">
                            <Download className="w-4 h-4" /> Download SVG (Vector)
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <button 
                      onClick={downloadBulk} 
                      disabled={isBulking || bulkData.trim().length === 0}
                      className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-md shadow-orange-200 transition-all active:scale-95 text-sm"
                    >
                      {isBulking ? <Settings className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />} 
                      {isBulking ? 'Generating ZIP...' : `Download ${bulkData.split('\n').filter(l => l.trim()).length} QR Codes (ZIP)`}
                    </button>
                  )}
                </div>
                
                <p className="text-[10px] text-center text-slate-400 font-medium mt-4 bg-slate-50 py-1.5 px-3 rounded-full">
                  100% Free & No Expiration
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
