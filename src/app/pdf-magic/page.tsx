"use client";

import { usePdfMagic } from "./usePdfMagic";
import {
  FileText, UploadCloud, Trash2, ArrowUp, ArrowDown,
  Settings, CheckCircle2, AlertCircle, Wand2, Plus, Scissors, ShieldAlert, Stamp, Crop, Eye, Minus
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

// [TL-PDF-MAGIC-01: PDF Magic Page]
export default function PdfMagicPage() {
  const {
    files,
    isMerging,
    isSplitting,
    isWatermarking,
    isCropping,
    error,
    addFiles,
    removeFile,
    moveFileUp,
    moveFileDown,
    clearAll,
    mergePdfs,
    splitPdf,
    watermarkPdf,
    cropEcommercePdf,
    generateCropPreview,
    setError
  } = usePdfMagic();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const cropInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  type TabType = 'merge' | 'split' | 'watermark' | 'crop';
  const [activeTab, setActiveTab] = useState<TabType>('merge');
  const [isToolSelected, setIsToolSelected] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved tab on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('pdf-magic-tab');
    if (savedTab === 'merge' || savedTab === 'split' || savedTab === 'watermark' || savedTab === 'crop') {
      setActiveTab(savedTab);
    }
    // Small delay to ensure the DOM updates before fading in, triggering the CSS transition
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsToolSelected(true);
    localStorage.setItem('pdf-magic-tab', tab);
  };

  // Split state
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState("");

  // Watermark state
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("");

  // Crop state
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropRatio, setCropRatio] = useState<number>(45.5); // 45.5% from top is usually perfect for Flipkart
  const [topRatio, setTopRatio] = useState<number>(3.0); // 3% white margin at the top
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [printerType, setPrinterType] = useState<'thermal' | 'a4'>('thermal');

  // Generate Live Preview for Crop
  useEffect(() => {
    let active = true;
    if (cropFile && activeTab === 'crop') {
      const generate = async () => {
        const url = await generateCropPreview(cropFile, cropRatio / 100, topRatio / 100);
        if (active && url) {
          if (previewUrl) URL.revokeObjectURL(previewUrl); // Cleanup old url
          setPreviewUrl(url);
        }
      };

      const timeoutId = setTimeout(generate, 300); // Debounce slider
      return () => {
        active = false;
        clearTimeout(timeoutId);
      };
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [cropFile, cropRatio, topRatio, activeTab]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSplitFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSplitFile(e.target.files[0]);
      setPageRanges("");
      setError(null);
      if (splitInputRef.current) splitInputRef.current.value = "";
    }
  };

  const handleWatermarkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setWatermarkFile(e.target.files[0]);
      setWatermarkText("");
      setError(null);
      if (watermarkInputRef.current) watermarkInputRef.current.value = "";
    }
  };

  const handleCropFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCropFile(e.target.files[0]);
      setError(null);
      if (cropInputRef.current) cropInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropMerge = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDropSplit = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSplitFile(e.dataTransfer.files[0]);
      setPageRanges("");
      setError(null);
    }
  };

  const handleDropWatermark = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setWatermarkFile(e.dataTransfer.files[0]);
      setWatermarkText("");
      setError(null);
    }
  };

  const handleDropCrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setCropFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!splitFile || !pageRanges) return;
    const success = await splitPdf(splitFile, pageRanges);
    if (success) {
      setSplitFile(null);
      setPageRanges("");
    }
  };

  const handleWatermarkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!watermarkFile || !watermarkText) return;
    const success = await watermarkPdf(watermarkFile, watermarkText);
    if (success) {
      setWatermarkFile(null);
      setWatermarkText("");
    }
  };

  const handleCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropFile) return;
    const success = await cropEcommercePdf(cropFile, cropRatio / 100, topRatio / 100, printerType);
    if (success) {
      setCropFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8 overflow-hidden px-2">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4 pt-4">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-4 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl sm:rounded-3xl shadow-lg shadow-purple-500/20">
            <Wand2 className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800">
            PDF Magic <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Pro</span>
          </h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          The ultimate all-in-one toolkit for your PDF files. <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-2 sm:mt-0"><CheckCircle2 className="w-4 h-4" /> 100% Secure & Local</span>
        </p>
      </div>

      <div className={`transition-all duration-700 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Tabs as Feature Cards */}
        {!isToolSelected && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mb-8">
          {/* Merge Tab */}
          <button
            onClick={() => { handleTabChange('merge'); setError(null); }}
            className={`flex flex-col items-start p-5 sm:p-6 rounded-3xl border-2 transition-all text-left group ${activeTab === 'merge' ? 'border-rose-500 bg-rose-50/80 shadow-md shadow-rose-500/10' : 'border-white/80 bg-white/50 hover:bg-white hover:border-rose-300 shadow-sm hover:shadow-md'}`}
          >
            <div className={`p-3 sm:p-3.5 rounded-2xl mb-4 transition-colors ${activeTab === 'merge' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-100 text-rose-600 group-hover:bg-rose-200'}`}>
              <FileText className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-lg sm:text-xl mb-2 ${activeTab === 'merge' ? 'text-rose-700' : 'text-slate-800'}`}>Merge PDFs</h3>
            <p className={`text-sm font-medium leading-relaxed ${activeTab === 'merge' ? 'text-rose-600/80' : 'text-slate-500'}`}>Combine multiple PDF files into a single document in your preferred order.</p>
          </button>

          {/* Split Tab */}
          <button
            onClick={() => { handleTabChange('split'); setError(null); }}
            className={`flex flex-col items-start p-5 sm:p-6 rounded-3xl border-2 transition-all text-left group ${activeTab === 'split' ? 'border-purple-500 bg-purple-50/80 shadow-md shadow-purple-500/10' : 'border-white/80 bg-white/50 hover:bg-white hover:border-purple-300 shadow-sm hover:shadow-md'}`}
          >
            <div className={`p-3 sm:p-3.5 rounded-2xl mb-4 transition-colors ${activeTab === 'split' ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'}`}>
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-lg sm:text-xl mb-2 ${activeTab === 'split' ? 'text-purple-700' : 'text-slate-800'}`}>Split PDF</h3>
            <p className={`text-sm font-medium leading-relaxed ${activeTab === 'split' ? 'text-purple-600/80' : 'text-slate-500'}`}>Extract specific pages or separate a large PDF into multiple smaller files.</p>
          </button>

          {/* Watermark Tab */}
          <button
            onClick={() => { handleTabChange('watermark'); setError(null); }}
            className={`flex flex-col items-start p-5 sm:p-6 rounded-3xl border-2 transition-all text-left group ${activeTab === 'watermark' ? 'border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-500/10' : 'border-white/80 bg-white/50 hover:bg-white hover:border-indigo-300 shadow-sm hover:shadow-md'}`}
          >
            <div className={`p-3 sm:p-3.5 rounded-2xl mb-4 transition-colors ${activeTab === 'watermark' ? 'bg-indigo-500 text-white shadow-md' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'}`}>
              <Stamp className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-lg sm:text-xl mb-2 ${activeTab === 'watermark' ? 'text-indigo-700' : 'text-slate-800'}`}>Add Watermark</h3>
            <p className={`text-sm font-medium leading-relaxed ${activeTab === 'watermark' ? 'text-indigo-600/80' : 'text-slate-500'}`}>Stamp custom text diagonally across all pages to secure your documents.</p>
          </button>

          {/* Crop Tab */}
          <button
            onClick={() => { handleTabChange('crop'); setError(null); }}
            className={`flex flex-col items-start p-5 sm:p-6 rounded-3xl border-2 transition-all text-left group ${activeTab === 'crop' ? 'border-orange-500 bg-orange-50/80 shadow-md shadow-orange-500/10' : 'border-white/80 bg-white/50 hover:bg-white hover:border-orange-300 shadow-sm hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-3 sm:p-3.5 rounded-2xl mb-4 transition-colors ${activeTab === 'crop' ? 'bg-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'}`}>
                <Crop className="w-6 h-6" />
              </div>
              <div className="flex -space-x-1.5 mt-1 transition-transform group-hover:scale-110">
                <img src="https://www.google.com/s2/favicons?domain=flipkart.com&sz=32" alt="Flipkart" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
                <img src="https://www.google.com/s2/favicons?domain=amazon.in&sz=32" alt="Amazon" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
                <img src="https://www.google.com/s2/favicons?domain=meesho.com&sz=32" alt="Meesho" className="w-6 h-6 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
            <h3 className={`font-bold text-lg sm:text-xl mb-2 ${activeTab === 'crop' ? 'text-orange-700' : 'text-slate-800'}`}>E-commerce Crop</h3>
            <p className={`text-sm font-medium leading-relaxed ${activeTab === 'crop' ? 'text-orange-600/80' : 'text-slate-500'}`}>Auto-crop Flipkart & Amazon shipping labels for 4x6 thermal printers.</p>
          </button>
        </div>
        )}

        {/* Tool Header */}
        {isToolSelected && (
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-slate-200 p-4 sm:p-5 rounded-3xl mb-6 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {activeTab === 'merge' && <div className="p-2 sm:p-3 bg-rose-100 text-rose-600 rounded-xl"><FileText className="w-5 h-5 sm:w-6 sm:h-6" /></div>}
              {activeTab === 'split' && <div className="p-2 sm:p-3 bg-purple-100 text-purple-600 rounded-xl"><Scissors className="w-5 h-5 sm:w-6 sm:h-6" /></div>}
              {activeTab === 'watermark' && <div className="p-2 sm:p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Stamp className="w-5 h-5 sm:w-6 sm:h-6" /></div>}
              {activeTab === 'crop' && <div className="p-2 sm:p-3 bg-orange-100 text-orange-600 rounded-xl"><Crop className="w-5 h-5 sm:w-6 sm:h-6" /></div>}
              <div>
                <h2 className="font-bold text-slate-800 text-lg sm:text-xl">
                  {activeTab === 'merge' && 'Merge PDFs'}
                  {activeTab === 'split' && 'Split PDF'}
                  {activeTab === 'watermark' && 'Add Watermark'}
                  {activeTab === 'crop' && 'E-commerce Crop'}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setIsToolSelected(false)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <span className="hidden sm:inline">Change Tool</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50/80 backdrop-blur-md border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 max-w-4xl mx-auto w-full mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold text-lg">&times;</button>
          </div>
        )}



        {/* Merge PDFs View */}
        {activeTab === 'merge' && isToolSelected && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="lg:col-span-5">
              <div
                className={`relative flex flex-col items-center justify-center w-full h-[250px] md:h-[350px] border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${isDragging ? "border-rose-500 bg-rose-50/50 scale-[1.02] shadow-lg shadow-rose-500/10" : "border-slate-300 bg-white/40 hover:bg-white/60 hover:border-rose-400 backdrop-blur-xl"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropMerge}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="application/pdf" className="hidden" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 px-4">
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="mb-2 text-lg sm:text-xl font-bold text-slate-700">
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Click to upload</span> or drag
                  </p>
                  <p className="text-sm font-medium text-slate-500">PDF Files Only</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 flex flex-col min-h-[350px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" /> Selected Files
                  <span className="bg-rose-100 text-rose-600 text-xs py-1 px-2.5 rounded-full font-bold">{files.length}</span>
                </h2>
                {files.length > 0 && (
                  <button onClick={clearAll} className="text-sm font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[350px] lg:max-h-[400px] custom-scrollbar">
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-medium text-lg">No PDFs selected yet.</p>
                    <p className="text-sm">Upload files to start merging.</p>
                  </div>
                ) : (
                  files.map((file, index) => (
                    <div key={file.id} className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-rose-300">
                      <div className="flex items-center justify-center w-10 h-10 bg-rose-50 rounded-xl text-rose-500 font-bold shrink-0">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{formatFileSize(file.size)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto mt-2 sm:mt-0">
                        <button onClick={() => moveFileUp(index)} disabled={index === 0} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Move Up"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveFileDown(index)} disabled={index === files.length - 1} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Move Down"><ArrowDown className="w-4 h-4" /></button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button onClick={() => removeFile(file.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {files.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">
                    <Plus className="w-5 h-5" /> Add More
                  </button>
                  <button
                    onClick={mergePdfs}
                    disabled={files.length < 2 || isMerging}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${files.length < 2 ? 'bg-slate-300 shadow-none cursor-not-allowed' : isMerging ? 'bg-gradient-to-r from-rose-400 to-purple-500 opacity-80 cursor-wait' : 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 hover:-translate-y-1 hover:shadow-rose-500/30'
                      }`}
                  >
                    {isMerging ? <><Settings className="w-5 h-5 animate-spin" /> Merging...</> : <><Wand2 className="w-5 h-5" /> {files.length < 2 ? 'Add 2+ PDFs' : 'Merge PDFs Now'}</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Split PDF View */}
        {activeTab === 'split' && isToolSelected && (
          <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 animate-in fade-in zoom-in-95 duration-300">
            {!splitFile ? (
              <div
                className={`relative flex flex-col items-center justify-center w-full h-[250px] md:h-[300px] border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${isDragging ? "border-purple-500 bg-purple-50/50 scale-[1.02] shadow-lg shadow-purple-500/10" : "border-slate-300 bg-white/40 hover:bg-white/60 hover:border-purple-400"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropSplit}
                onClick={() => splitInputRef.current?.click()}
              >
                <input type="file" ref={splitInputRef} onChange={handleSplitFileSelect} accept="application/pdf" className="hidden" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 px-4">
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-purple-600 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                    <Scissors className="w-10 h-10" />
                  </div>
                  <p className="mb-2 text-lg sm:text-xl font-bold text-slate-700">
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Select PDF to Split</span>
                  </p>
                  <p className="text-sm font-medium text-slate-500">Extract pages or split into a new file.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 md:p-5 bg-white/80 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-xl font-bold shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-800 truncate" title={splitFile.name}>{splitFile.name}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">{formatFileSize(splitFile.size)}</p>
                  </div>
                  <button onClick={() => setSplitFile(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSplitSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Pages to Extract</label>
                    <input
                      type="text"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      required
                      placeholder="e.g. 1-5, 8, 11-13"
                      className="w-full p-4 rounded-xl border border-white/60 bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                    />
                    <p className="text-xs text-slate-500 font-medium px-1">Specify individual pages or ranges separated by commas.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!pageRanges || isSplitting}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${!pageRanges ? 'bg-slate-300 shadow-none cursor-not-allowed' : isSplitting ? 'bg-purple-400 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-purple-500/30'
                      }`}
                  >
                    {isSplitting ? <><Settings className="w-5 h-5 animate-spin" /> Extracting...</> : <><Scissors className="w-5 h-5" /> Extract & Download</>}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Watermark PDF View */}
        {activeTab === 'watermark' && isToolSelected && (
          <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 animate-in fade-in zoom-in-95 duration-300">
            {!watermarkFile ? (
              <div
                className={`relative flex flex-col items-center justify-center w-full h-[250px] md:h-[300px] border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${isDragging ? "border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-lg shadow-indigo-500/10" : "border-slate-300 bg-white/40 hover:bg-white/60 hover:border-indigo-400"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropWatermark}
                onClick={() => watermarkInputRef.current?.click()}
              >
                <input type="file" ref={watermarkInputRef} onChange={handleWatermarkFileSelect} accept="application/pdf" className="hidden" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 px-4">
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                    <Stamp className="w-10 h-10" />
                  </div>
                  <p className="mb-2 text-lg sm:text-xl font-bold text-slate-700">
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Select PDF</span> to watermark
                  </p>
                  <p className="text-sm font-medium text-slate-500">Add secure watermark to protect files.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 md:p-5 bg-white/80 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl font-bold shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-800 truncate" title={watermarkFile.name}>{watermarkFile.name}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">{formatFileSize(watermarkFile.size)}</p>
                  </div>
                  <button onClick={() => setWatermarkFile(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleWatermarkSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      required
                      placeholder="e.g. ONLY FOR KYC"
                      className="w-full p-4 rounded-xl border border-white/60 bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                    />
                    <p className="text-xs text-slate-500 font-medium px-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                      Text will be stamped diagonally on all pages to prevent misuse.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!watermarkText || isWatermarking}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${!watermarkText ? 'bg-slate-300 shadow-none cursor-not-allowed' : isWatermarking ? 'bg-indigo-400 cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:-translate-y-1 hover:shadow-indigo-500/30'
                      }`}
                  >
                    {isWatermarking ? <><Settings className="w-5 h-5 animate-spin" /> Processing...</> : <><Stamp className="w-5 h-5" /> Add Watermark & Download</>}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* E-Commerce Crop View */}
        {activeTab === 'crop' && isToolSelected && (
          <div className={`mx-auto bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 animate-in fade-in zoom-in-95 duration-300 ${cropFile ? 'max-w-6xl' : 'max-w-3xl'}`}>
            {!cropFile ? (
              <div
                className={`relative flex flex-col items-center justify-center w-full h-[250px] md:h-[300px] border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${isDragging ? "border-orange-500 bg-orange-50/50 scale-[1.02] shadow-lg shadow-orange-500/10" : "border-slate-300 bg-white/40 hover:bg-white/60 hover:border-orange-400"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropCrop}
                onClick={() => cropInputRef.current?.click()}
              >
                <input type="file" ref={cropInputRef} onChange={handleCropFileSelect} accept="application/pdf" className="hidden" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 px-4">
                  <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${isDragging ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                    <Crop className="w-10 h-10" />
                  </div>
                  <p className="mb-2 text-lg sm:text-xl font-bold text-slate-700">
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Select E-commerce PDF</span>
                  </p>
                  <p className="text-sm font-medium text-slate-500">Perfectly crop shipping labels for thermal printers.</p>
                  <div className="flex gap-2.5 mt-5 opacity-90">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100"><img src="https://www.google.com/s2/favicons?domain=flipkart.com&sz=64" alt="Flipkart" className="w-5 h-5 rounded-sm" /></div>
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100"><img src="https://www.google.com/s2/favicons?domain=amazon.in&sz=64" alt="Amazon" className="w-5 h-5 rounded-sm" /></div>
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100"><img src="https://www.google.com/s2/favicons?domain=meesho.com&sz=64" alt="Meesho" className="w-5 h-5 rounded-sm" /></div>
                    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100"><img src="https://www.google.com/s2/favicons?domain=myntra.com&sz=64" alt="Myntra" className="w-5 h-5 rounded-sm" /></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* Controls Panel */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 md:p-5 bg-white/80 border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-xl font-bold shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-800 truncate" title={cropFile.name}>{cropFile.name}</p>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">{formatFileSize(cropFile.size)}</p>
                    </div>
                    <button onClick={() => { setCropFile(null); setPreviewUrl(null); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCropSubmit} className="space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                      <h4 className="font-bold text-orange-800 mb-1">Smart Crop & Split</h4>
                      <p className="text-sm text-orange-700">This will magically separate your file into <b>two PDFs</b>: one containing only perfectly sized 4x6 Thermal Labels, and another with just the Tax Invoices.</p>
                    </div>

                    <div className="space-y-3 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
                      {/* Auto Presets */}
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setCropRatio(45.5); setTopRatio(3); }} className="flex-1 py-3 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm border border-blue-200 hover:bg-blue-100 active:scale-95 transition-all">
                          <img src="https://www.google.com/s2/favicons?domain=flipkart.com&sz=32" alt="Flipkart Logo" className="w-5 h-5 rounded-sm" />
                          Flipkart
                        </button>
                        <button type="button" onClick={() => { setCropRatio(50); setTopRatio(3); }} className="flex-1 py-3 flex items-center justify-center gap-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all">
                          <img src="https://www.google.com/s2/favicons?domain=amazon.in&sz=32" alt="Amazon Logo" className="w-5 h-5 rounded-sm" />
                          Amazon
                        </button>
                        <button type="button" onClick={() => { setCropRatio(55); setTopRatio(3); }} className="flex-1 py-3 flex items-center justify-center gap-2 bg-pink-50 text-pink-600 rounded-xl font-bold text-sm border border-pink-200 hover:bg-pink-100 active:scale-95 transition-all">
                          <img src="https://www.google.com/s2/favicons?domain=meesho.com&sz=32" alt="Meesho Logo" className="w-5 h-5 rounded-sm" />
                          Meesho
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-medium text-center">Select your platform for perfect auto-crop settings.</p>
                    </div>

                    <div className="space-y-2 p-1">
                      <label className="text-sm font-bold text-slate-700 px-1">Select Output Printer Type</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${printerType === 'thermal' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-slate-50'}`}>
                          <input type="radio" name="printer" value="thermal" checked={printerType === 'thermal'} onChange={() => setPrinterType('thermal')} className="hidden" />
                          <span className="font-bold text-sm">Thermal Printer</span>
                          <span className="text-xs opacity-80 mt-0.5">(4x6 Labels PDF)</span>
                        </label>
                        <label className={`flex-1 flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${printerType === 'a4' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-slate-50'}`}>
                          <input type="radio" name="printer" value="a4" checked={printerType === 'a4'} onChange={() => setPrinterType('a4')} className="hidden" />
                          <span className="font-bold text-sm">Normal A4 Printer</span>
                          <span className="text-xs opacity-80 mt-0.5">(4 Labels per Page)</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCropping}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg mt-6 ${isCropping ? 'bg-orange-400 cursor-wait' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:-translate-y-1 hover:shadow-orange-500/30'
                        }`}
                    >
                      {isCropping ? <><Settings className="w-5 h-5 animate-spin" /> Magic in progress...</> : <><Crop className="w-5 h-5" /> Crop & Download ZIP</>}
                    </button>
                  </form>
                </div>

                {/* Live Preview Panel */}
                <div className="flex flex-col bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden h-[400px] lg:h-[500px]">
                  {/* Header Bar */}
                  <div className="bg-white px-4 py-2 border-b border-slate-200 flex justify-between items-center z-10 shadow-sm shrink-0">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Eye className="w-4 h-4 text-orange-500" /> Live Preview</span>

                    {previewUrl && (
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200 shadow-sm">
                        <span className="text-slate-500 text-[10px] font-bold uppercase ml-1 sm:ml-2">Top Crop</span>
                        <button type="button" onClick={() => setTopRatio(r => Math.max(0, r - 0.5))} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-200 shadow-sm text-slate-700 hover:text-orange-500 hover:border-orange-300 active:scale-95 transition-all">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-slate-800 text-xs font-bold w-10 text-center">{topRatio.toFixed(1)}%</span>
                        <button type="button" onClick={() => setTopRatio(r => Math.min(20, r + 0.5))} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-200 shadow-sm text-slate-700 hover:text-orange-500 hover:border-orange-300 active:scale-95 transition-all">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md hidden sm:block">Page 1 Only</span>
                  </div>

                  {/* Iframe Container */}
                  <div className="flex-1 relative w-full bg-slate-100">
                    {previewUrl ? (
                      <iframe
                        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-full h-full border-0"
                        title="Label Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Settings className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm font-medium">Generating preview...</span>
                      </div>
                    )}
                    {/* Visual indicator of a laser cut */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_rgba(249,115,22,1)] opacity-80 z-20 pointer-events-none"></div>
                  </div>

                  {/* Footer Bar */}
                  {previewUrl && (
                    <div className="bg-white px-4 py-2 border-t border-slate-200 flex justify-center items-center z-10 shadow-sm shrink-0">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200 shadow-sm">
                        <span className="text-slate-500 text-[10px] font-bold uppercase ml-2">Bottom Crop</span>
                        <button type="button" onClick={() => setCropRatio(r => Math.max(35, r - 0.5))} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-200 shadow-sm text-slate-700 hover:text-orange-500 hover:border-orange-300 active:scale-95 transition-all">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-slate-800 text-xs font-bold w-10 text-center">{cropRatio.toFixed(1)}%</span>
                        <button type="button" onClick={() => setCropRatio(r => Math.min(65, r + 0.5))} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-200 shadow-sm text-slate-700 hover:text-orange-500 hover:border-orange-300 active:scale-95 transition-all">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
