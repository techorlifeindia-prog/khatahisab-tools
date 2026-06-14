import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// [TL-IMG-H-01: Image Compression Logic]
export interface CompressedFile {
  id: string;
  originalFile: File;
  compressedFile: File | null;
  originalSize: number;
  compressedSize: number;
  status: 'pending' | 'compressing' | 'success' | 'error';
  progress: number;
}

export function useImageCompressor() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const mappedFiles: CompressedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      compressedFile: null,
      originalSize: file.size,
      compressedSize: 0,
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...mappedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const compressFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    let maxSizeMB = 1;
    let maxWidthOrHeight = 1920;

    if (compressionLevel === 'low') {
      maxSizeMB = 2;
      maxWidthOrHeight = 2560;
    } else if (compressionLevel === 'high') {
      maxSizeMB = 0.5;
      maxWidthOrHeight = 1280;
    }

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'success') continue; // Skip already compressed

      updatedFiles[i] = { ...updatedFiles[i], status: 'compressing', progress: 10 };
      setFiles([...updatedFiles]);

      try {
        const options = {
          maxSizeMB,
          maxWidthOrHeight,
          useWebWorker: true,
          onProgress: (p: number) => {
            updatedFiles[i] = { ...updatedFiles[i], progress: p };
            setFiles([...updatedFiles]);
          }
        };

        const compressedBlob = await imageCompression(updatedFiles[i].originalFile, options);
        // Sometimes it might not compress smaller if already optimized
        const isSmaller = compressedBlob.size < updatedFiles[i].originalSize;
        const finalBlob = isSmaller ? compressedBlob : updatedFiles[i].originalFile;

        updatedFiles[i] = {
          ...updatedFiles[i],
          compressedFile: new File([finalBlob], updatedFiles[i].originalFile.name, { type: finalBlob.type }),
          compressedSize: finalBlob.size,
          status: 'success',
          progress: 100,
        };
      } catch (error) {
        console.error('Compression error:', error);
        updatedFiles[i] = { ...updatedFiles[i], status: 'error' };
      }
      setFiles([...updatedFiles]);
    }

    setIsProcessing(false);
  };

  const downloadFile = (file: CompressedFile) => {
    if (file.compressedFile) {
      saveAs(file.compressedFile, `m3bharat_${file.compressedFile.name}`);
    }
  };

  const downloadAllZip = async () => {
    const successFiles = files.filter(f => f.status === 'success' && f.compressedFile);
    if (successFiles.length === 0) return;

    const zip = new JSZip();
    successFiles.forEach(f => {
      if (f.compressedFile) {
        zip.file(`m3bharat_${f.compressedFile.name}`, f.compressedFile);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'm3bharat_compressed_images.zip');
  };

  return {
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
  };
}
