'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Download, Sparkles, Paintbrush, ArrowLeft, Loader2, ArrowRightLeft, Palette, SlidersHorizontal, Maximize } from 'lucide-react';
import Link from 'next/link';
import { removeBackground, Config } from '@imgly/background-removal';

export default function BgRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Initializing AI...');
  
  // Customization states
  const [bgColor, setBgColor] = useState('transparent');
  const [customImageBg, setCustomImageBg] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  // E-commerce Edit States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [outputSize, setOutputSize] = useState('original');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setResultImage(null);
    setCustomImageBg(null);
    setBgColor('transparent');
    setSliderPosition(50);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setShadowBlur(0);
    setOutputSize('original');
    
    await processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setProgressText('Loading AI Model (this takes a moment on first run)...');

    try {
      const config: Config = {
        model: 'isnet', // Force highest quality model
        output: {
          format: 'image/png',
          quality: 1
        },
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100);
          setProgress(percent);
          if (key === 'compute:inference') {
            setProgressText('Removing Background...');
          } else if (key.startsWith('fetch:')) {
            setProgressText(`Downloading AI Assets... ${percent}%`);
          }
        }
      };

      const blob = await removeBackground(file, config);
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (error) {
      console.error("Background removal failed:", error);
      alert("Failed to remove background. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageBg(URL.createObjectURL(file));
      setBgColor('custom-image');
    }
  };

  const downloadImage = () => {
    if (!resultImage || !originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const origImg = new Image();
    
    origImg.onload = () => {
      img.onload = () => {
        let targetWidth = origImg.width;
        let targetHeight = origImg.height;

        if (outputSize === '1080x1080') {
          targetWidth = 1080;
          targetHeight = 1080;
        } else if (outputSize === '1200x1600') {
          targetWidth = 1200;
          targetHeight = 1600;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        if (!ctx) return;

        const drawFinal = () => {
          let drawW = img.width;
          let drawH = img.height;
          let dx = (targetWidth - img.width) / 2;
          let dy = (targetHeight - img.height) / 2;

          if (outputSize !== 'original') {
             // For preset sizes, scale product to fit nicely (with 5% padding)
             const scale = Math.min((targetWidth * 0.95) / img.width, (targetHeight * 0.95) / img.height);
             drawW = img.width * scale;
             drawH = img.height * scale;
             dx = (targetWidth - drawW) / 2;
             dy = (targetHeight - drawH) / 2;
          }

          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${shadowBlur > 0 ? `drop-shadow(0px ${shadowBlur/2}px ${shadowBlur}px rgba(0,0,0,0.4))` : ''}`;
          ctx.drawImage(img, dx, dy, drawW, drawH);
          ctx.filter = 'none';

          triggerDownload(canvas.toDataURL('image/png', 1.0));
        };

        if (bgColor === 'transparent' && !customImageBg) {
          // If transparent, we don't draw a background rect
          drawFinal();
        } else if (bgColor === 'custom-image' && customImageBg) {
          const bgImg = new Image();
          bgImg.onload = () => {
            // Fill background with image cover style
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            drawFinal();
          };
          bgImg.src = customImageBg;
        } else {
          // Draw solid color
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawFinal();
        }
      };
      img.src = resultImage;
    };
    origImg.src = originalImage;
  };

  const triggerDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `removed-bg-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-1.5 rounded-lg text-white shadow-sm shadow-pink-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight">AI Background Remover <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-black ml-1">Local HD</span></h1>
                  <p className="text-[10px] text-slate-500 font-medium">100% Secure &bull; No Uploads &bull; Free HD</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!originalImage ? (
          // Upload State
          <div className="max-w-3xl mx-auto mt-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-4">Remove Background Instantly</h2>
              <p className="text-slate-500 text-sm">Our AI runs entirely in your browser. Your photos are never uploaded to any server. 100% private and Free HD downloads.</p>
            </div>
            
            <label className="flex flex-col items-center justify-center w-full h-80 border-3 border-dashed border-rose-300 rounded-3xl cursor-pointer bg-white hover:bg-rose-50/50 transition-all shadow-sm group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10" />
                </div>
                <p className="mb-2 text-xl font-bold text-slate-700">Click to upload image</p>
                <p className="text-sm text-slate-500 font-medium">or drag and drop</p>
                <p className="text-xs text-slate-400 mt-4 px-3 py-1 bg-slate-100 rounded-full">Supports JPG, PNG, WEBP</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
            
            <div className="flex justify-center mt-6 gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"><Sparkles className="w-4 h-4 text-amber-500"/> AI Powered</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"><Download className="w-4 h-4 text-emerald-500"/> Free HD</div>
            </div>
          </div>
        ) : (
          // Processing & Result State
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Preview / Slider */}
            <div className="lg:col-span-8">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden h-[500px] flex items-center justify-center checkered-bg">
                
                {isProcessing ? (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{progressText}</h3>
                    <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 font-medium">Running Local AI directly on your device...</p>
                  </div>
                ) : null}

                {/* Display Before/After Slider if Result exists */}
                {resultImage && !isProcessing ? (
                  <div className="relative w-full h-full flex items-center justify-center group" style={{ userSelect: 'none' }}>
                    
                    <div className="relative inline-block max-w-full max-h-[460px] rounded-lg overflow-hidden">
                      
                      {/* 1. Base Layer: Custom Background */}
                      {bgColor !== 'transparent' && (
                        <div 
                          className="absolute inset-0 pointer-events-none" 
                          style={bgColor === 'custom-image' && customImageBg ? { backgroundImage: `url(${customImageBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: bgColor }}
                        ></div>
                      )}

                      {/* 2. Result Image */}
                      <img 
                        src={resultImage} 
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                        alt="Result" 
                        draggable="false" 
                        style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${shadowBlur > 0 ? `drop-shadow(0px ${shadowBlur/2}px ${shadowBlur}px rgba(0,0,0,0.4))` : ''}` }}
                      />

                      {/* 3. Original Image (Clipped by slider) */}
                      <img src={originalImage} className="block max-w-full max-h-[460px] object-contain relative z-10" alt="Original" draggable="false" style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }} />

                      {/* Slider Control */}
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={sliderPosition} 
                        onChange={handleSliderChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                      />
                      
                      {/* Slider Line Visual */}
                      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none transition-transform duration-75" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-rose-500 rounded-full shadow-lg flex items-center justify-center border border-slate-100">
                            <ArrowRightLeft className="w-4 h-4" />
                         </div>
                      </div>

                    </div>
                  </div>
                ) : null}

              </div>
              
              {!isProcessing && resultImage && (
                <div className="mt-4 flex items-center justify-between px-2">
                   <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><ArrowRightLeft className="w-4 h-4"/> Drag slider to compare Original vs Removed</p>
                   <button onClick={() => { setOriginalImage(null); setResultImage(null); }} className="text-xs font-bold text-indigo-600 hover:underline">Upload New Image</button>
                </div>
              )}
            </div>

            {/* Right Column: Tools */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Paintbrush className="w-4 h-4 text-rose-500"/> Background Options</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => setBgColor('transparent')} className={`h-10 rounded-xl border-2 ${bgColor === 'transparent' ? 'border-rose-500 shadow-sm' : 'border-slate-200'} checkered-bg flex items-center justify-center`}></button>
                    <button onClick={() => setBgColor('#ffffff')} className={`h-10 rounded-xl border-2 bg-white ${bgColor === '#ffffff' ? 'border-rose-500 shadow-sm' : 'border-slate-200'}`}></button>
                    <button onClick={() => setBgColor('#000000')} className={`h-10 rounded-xl border-2 bg-black ${bgColor === '#000000' ? 'border-rose-500 shadow-sm' : 'border-slate-200'}`}></button>
                    <button onClick={() => setBgColor('#f87171')} className={`h-10 rounded-xl border-2 bg-red-400 ${bgColor === '#f87171' ? 'border-rose-500 shadow-sm' : 'border-slate-200'}`}></button>
                    <button onClick={() => setBgColor('#60a5fa')} className={`h-10 rounded-xl border-2 bg-blue-400 ${bgColor === '#60a5fa' ? 'border-rose-500 shadow-sm' : 'border-slate-200'}`}></button>
                    <button onClick={() => setBgColor('#34d399')} className={`h-10 rounded-xl border-2 bg-emerald-400 ${bgColor === '#34d399' ? 'border-rose-500 shadow-sm' : 'border-slate-200'}`}></button>
                    <button onClick={() => setBgColor('#a78bfa')} className={`h-10 rounded-xl border-2 bg-purple-400 ${bgColor === '#a78bfa' ? 'border-rose-500 shadow-sm' : 'border-slate-200'}`}></button>
                    <div className="relative">
                      <input type="color" value={bgColor !== 'transparent' && bgColor !== 'custom-image' ? bgColor : '#ff0000'} onChange={(e) => setBgColor(e.target.value)} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                      <div className="h-10 rounded-xl border-2 border-slate-200 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                        <Palette className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-600">Upload Custom Background</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleCustomBgUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-blue-500"/> E-Commerce Editor</h3>
                
                <div className="space-y-4">
                  {/* Output Size Presets */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5"/> Canvas Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setOutputSize('original')} className={`text-[10px] font-bold py-1.5 rounded-lg border-2 ${outputSize === 'original' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors'}`}>Original</button>
                      <button onClick={() => setOutputSize('1080x1080')} className={`text-[10px] font-bold py-1.5 rounded-lg border-2 ${outputSize === '1080x1080' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors'}`}>1:1 Square</button>
                      <button onClick={() => setOutputSize('1200x1600')} className={`text-[10px] font-bold py-1.5 rounded-lg border-2 ${outputSize === '1200x1600' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors'}`}>3:4 Portrait</button>
                    </div>
                  </div>

                  {/* Adjustments Sliders */}
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-600">Brightness</label>
                        <span className="text-[10px] font-bold text-slate-400">{brightness}%</span>
                      </div>
                      <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-600">Contrast</label>
                        <span className="text-[10px] font-bold text-slate-400">{contrast}%</span>
                      </div>
                      <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-600">Saturation</label>
                        <span className="text-[10px] font-bold text-slate-400">{saturation}%</span>
                      </div>
                      <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-600">Drop Shadow</label>
                        <span className="text-[10px] font-bold text-slate-400">{shadowBlur > 0 ? shadowBlur : 'None'}</span>
                      </div>
                      <input type="range" min="0" max="100" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <button 
                  onClick={downloadImage} 
                  disabled={!resultImage || isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" /> Download HD Quality
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium mt-3">Full resolution. No watermarks.</p>
              </div>

            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .checkered-bg {
          background-color: #f0f0f0;
          background-image: 
            linear-gradient(45deg, #ddd 25%, transparent 25%), 
            linear-gradient(-45deg, #ddd 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #ddd 75%), 
            linear-gradient(-45deg, transparent 75%, #ddd 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}} />
    </div>
  );
}
