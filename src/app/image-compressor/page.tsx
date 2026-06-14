"use client";

import { useImageCompressor } from "./useImageCompressor";
import { UploadCloud, Image as ImageIcon, Trash2, DownloadCloud, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

// [TL-IMG-F-01: Image Compressor Premium UI]
export default function ImageCompressorPage() {
  const {
    files,
    addFiles,
    removeFile,
    clearAll,
    compressFiles,
    downloadFile,
    downloadAllZip,
    compressionLevel,
    setCompressionLevel,
    isProcessing,
  } = useImageCompressor();

  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (original: number, compressed: number) => {
    if (!original || !compressed) return 0;
    const diff = original - compressed;
    if (diff <= 0) return 0;
    return Math.round((diff / original) * 100);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, [addFiles]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3 px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 leading-tight">
          Bulk Image Compressor 
          <span className="px-3 md:px-4 py-1 text-sm sm:text-lg md:text-2xl bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 shadow-sm mt-2 sm:mt-0">
            100% Private
          </span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto font-medium">
          Compress unlimited images instantly right in your browser. <br className="hidden sm:block"/> Zero server uploads. Zero file limits.
        </p>
      </div>

      {/* Settings & Upload Area - Glassmorphism */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Settings Bar */}
        <div className="border-b border-white/50 p-5 bg-white/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600 bg-white/50 px-3 py-1.5 rounded-xl shadow-sm border border-white/60">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-sm">Quality</span>
            </div>
            <div className="flex bg-slate-200/50 p-1.5 rounded-xl shadow-inner">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setCompressionLevel(level)}
                  className={`px-5 py-1.5 text-sm font-bold rounded-lg capitalize transition-all duration-300 ${
                    compressionLevel === level 
                    ? 'bg-white text-blue-600 shadow-md scale-105' 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                  disabled={isProcessing}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          {files.length > 0 && (
            <button 
              onClick={clearAll}
              disabled={isProcessing}
              className="text-sm font-bold text-red-500 hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
            >
              Clear All Files
            </button>
          )}
        </div>

        {/* Drag & Drop Zone */}
        <div className="p-4 md:p-6">
            <div 
            className={`relative p-6 md:p-10 text-center transition-all duration-300 rounded-2xl border-2 border-dashed ${
                isDragging 
                ? 'bg-blue-50/80 border-blue-400 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                : 'bg-white/40 border-slate-300 hover:border-blue-300 hover:bg-white/60'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            >
            <div className={`w-12 h-12 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-3 md:mb-5 transition-transform duration-500 ${isDragging ? 'scale-110 bg-blue-100 text-blue-600 shadow-xl shadow-blue-200' : 'bg-slate-100/80 text-slate-400 shadow-md'}`}>
                <UploadCloud className={`w-6 h-6 md:w-10 md:h-10 transition-transform duration-500 ${isDragging ? '-translate-y-2' : ''}`} />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1 md:mb-2 tracking-tight">Drop your magical images here</h3>
            <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6 font-medium">Supports JPG, PNG, WebP. No limits forever.</p>
            <label className="inline-flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl md:rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(59,130,246,0.4)]">
                Browse Files
                <input 
                type="file" 
                className="hidden" 
                multiple 
                accept="image/*"
                onChange={onFileInputChange}
                />
            </label>
            </div>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 border-b border-white/50 bg-white/40 flex flex-wrap gap-4 items-center justify-between">
            <h3 className="font-extrabold text-slate-800 flex items-center gap-3 text-lg">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><ImageIcon className="w-5 h-5" /></div>
              {files.length} Images Ready
            </h3>
            
            <div className="flex gap-4">
              {files.some(f => f.status === 'pending') && (
                <button
                  onClick={compressFiles}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  {isProcessing ? 'Compressing...' : 'Start Compression'}
                </button>
              )}
              {files.some(f => f.status === 'success') && !isProcessing && (
                <button
                  onClick={downloadAllZip}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                >
                  <DownloadCloud className="w-5 h-5" /> Download ZIP
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100/50">
            {files.map(file => (
              <div key={file.id} className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 hover:bg-white/60 transition-colors">
                <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto flex-1 min-w-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={URL.createObjectURL(file.originalFile)} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-bold text-slate-800 truncate">{file.originalFile.name}</p>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-3 mt-1 text-xs md:text-sm font-medium text-slate-500">
                      <span className="bg-slate-100 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-md">{formatBytes(file.originalSize)}</span>
                      {file.status === 'success' && (
                        <>
                          <span className="text-slate-300">➔</span>
                          <span className="font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-md">{formatBytes(file.compressedSize)}</span>
                          <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-md bg-emerald-500 text-white font-bold shadow-sm">
                            -{calculateSavings(file.originalSize, file.compressedSize)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-40 flex items-center justify-between sm:justify-end mt-2 sm:mt-0 pl-15 sm:pl-0">
                  {file.status === 'pending' && <span className="text-xs md:text-sm font-bold text-slate-400 bg-slate-50 px-2 md:px-3 py-1 rounded-lg">Waiting</span>}
                  {file.status === 'compressing' && (
                     <div className="w-full bg-slate-100 rounded-full h-2 md:h-3 overflow-hidden shadow-inner border border-slate-200">
                       <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }}></div>
                     </div>
                  )}
                  {file.status === 'error' && <span className="text-xs md:text-sm font-bold text-red-500 flex items-center gap-1 bg-red-50 px-2 md:px-3 py-1 rounded-lg"><AlertCircle className="w-3 h-3 md:w-4 md:h-4"/> Error</span>}
                  {file.status === 'success' && (
                    <div className="flex items-center gap-2 md:gap-3">
                      <button onClick={() => downloadFile(file)} className="p-2 md:p-2.5 text-blue-600 hover:bg-blue-50 bg-white shadow-sm border border-blue-100 rounded-lg md:rounded-xl transition-all hover:-translate-y-1 hover:shadow-md" title="Download Image">
                        <DownloadCloud className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  )}
                  {!isProcessing && (
                    <button onClick={() => removeFile(file.id)} className="p-2 md:p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all sm:ml-2">
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
