import { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export function usePdfMagic() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isWatermarking, setIsWatermarking] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length < newFiles.length) {
      setError("Some files were skipped because they are not PDFs.");
    } else {
      setError(null);
    }

    const items: PdfFileItem[] = pdfFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles(prev => [...prev, ...items]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index - 1];
      newFiles[index - 1] = newFiles[index];
      newFiles[index] = temp;
      return newFiles;
    });
  };

  const moveFileDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index + 1];
      newFiles[index + 1] = newFiles[index];
      newFiles[index] = temp;
      return newFiles;
    });
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile as any], { type: 'application/pdf' });
      saveAs(blob, `M3Bharat_Merged_${new Date().getTime()}.pdf`);

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('encrypted')) {
        setError("Failed to merge. One of the files is password protected. Please unlock it first!");
      } else {
        setError("Failed to merge PDFs. One of the files might be corrupted.");
      }
    } finally {
      setIsMerging(false);
    }
  };

  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(s => s.trim()).filter(s => s);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          pages.add(pageNum - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPdf = async (file: File, pageRanges: string): Promise<boolean> => {
    setIsSplitting(true);
    setError(null);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const totalPages = pdfDoc.getPageCount();

      const pageIndicesToExtract = parsePageRanges(pageRanges, totalPages);

      if (pageIndicesToExtract.length === 0) {
        setError("Invalid page range. Please enter valid page numbers (e.g. '1, 3, 5-7').");
        setIsSplitting(false);
        return false;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndicesToExtract);
      copiedPages.forEach(page => newPdf.addPage(page));

      const savedPdf = await newPdf.save();
      const blob = new Blob([savedPdf as any], { type: 'application/pdf' });
      saveAs(blob, `Extracted_${file.name}`);
      return true;
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('encrypted')) {
        setError("Cannot extract pages from a password-protected PDF.");
      } else {
        setError("Failed to split PDF. The file might be corrupted.");
      }
      return false;
    } finally {
      setIsSplitting(false);
    }
  };

  const watermarkPdf = async (file: File, text: string): Promise<boolean> => {
    setIsWatermarking(true);
    setError(null);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textSize = 60;
        const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);

        // Calculate center and diagonal rotation
        const x = (width - textWidth) / 2;
        const y = height / 2 - textSize / 2;

        page.drawText(text, {
          x,
          y,
          size: textSize,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        });
      }

      const savedPdf = await pdfDoc.save();
      const blob = new Blob([savedPdf as any], { type: 'application/pdf' });
      saveAs(blob, `Watermarked_${file.name}`);
      return true;
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('encrypted')) {
        setError("Cannot add watermark to a password-protected PDF.");
      } else {
        setError("Failed to add watermark. The file might be corrupted.");
      }
      return false;
    } finally {
      setIsWatermarking(false);
    }
  };

  const cropEcommercePdf = async (file: File, bottomRatio: number, topRatio: number, printerType: 'thermal' | 'a4'): Promise<boolean> => {
    setIsCropping(true);
    setError(null);
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);

      const pages = pdfDoc.getPages();

      const A4_WIDTH = 595.28;
      const A4_HEIGHT = 841.89;
      let currentA4Page: any = null;
      let labelCount = 0;

      // Create two separate documents for labels and invoices
      const labelsPdf = await PDFDocument.create();
      const invoicesPdf = await PDFDocument.create();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // 1. Label part
        const topY = height * (1 - topRatio);
        const bottomY = height * (1 - bottomRatio);
        const labelHeight = topY - bottomY;

        if (printerType === 'thermal') {
          const [labelPage] = await labelsPdf.copyPages(pdfDoc, [i]);
          labelPage.setCropBox(0, bottomY, width, labelHeight);
          labelsPdf.addPage(labelPage);
        } else {
          // A4 logic - 4 labels per page
          if (labelCount % 4 === 0) {
            currentA4Page = labelsPdf.addPage([A4_WIDTH, A4_HEIGHT]);
          }

          const embeddedLabel = await labelsPdf.embedPage(page, {
            left: 0,
            bottom: bottomY,
            right: width,
            top: topY
          });

          const quadIndex = labelCount % 4;
          const col = quadIndex % 2;
          const row = Math.floor(quadIndex / 2);

          const quadW = A4_WIDTH / 2;
          const quadH = A4_HEIGHT / 2;
          const padding = 15;

          const targetW = quadW - padding * 2;
          const targetH = quadH - padding * 2;

          const scale = Math.min(targetW / width, targetH / labelHeight);
          const drawW = width * scale;
          const drawH = labelHeight * scale;

          const x = col * quadW + (quadW - drawW) / 2;
          const y = (1 - row) * quadH + (quadH - drawH) / 2;

          currentA4Page.drawPage(embeddedLabel, {
            x, y, width: drawW, height: drawH
          });

          labelCount++;
        }

        // 2. Invoice part
        const [invoicePage] = await invoicesPdf.copyPages(pdfDoc, [i]);
        invoicePage.setCropBox(0, 0, width, bottomY);
        invoicesPdf.addPage(invoicePage);
      }

      const labelsBytes = await labelsPdf.save();
      const invoicesBytes = await invoicesPdf.save();

      // Zip the two files together to avoid browser blocking multiple downloads
      const zip = new JSZip();
      zip.file(`Labels_${file.name}`, labelsBytes);
      zip.file(`Invoices_${file.name}`, invoicesBytes);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `Ecommerce_Labels_Invoices.zip`);

      return true;
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('encrypted')) {
        setError("Cannot crop a password-protected PDF.");
      } else {
        setError("Failed to crop PDF. The file might be corrupted.");
      }
      return false;
    } finally {
      setIsCropping(false);
    }
  };

  const generateCropPreview = async (file: File, bottomRatio: number, topRatio: number): Promise<string | null> => {
    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);

      const previewPdf = await PDFDocument.create();
      const [copiedPage] = await previewPdf.copyPages(pdfDoc, [0]);

      const { width, height } = copiedPage.getSize();

      const topY = height * (1 - topRatio);
      const bottomY = height * (1 - bottomRatio);
      const labelHeight = topY - bottomY;

      copiedPage.setCropBox(0, bottomY, width, labelHeight);

      previewPdf.addPage(copiedPage);

      const savedPdf = await previewPdf.save();
      const blob = new Blob([savedPdf as any], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Preview generation failed:", err);
      return null;
    }
  };

  return {
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
  };
}
