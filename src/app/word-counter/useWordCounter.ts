import { useState, useMemo } from 'react';

// [TL-WORD-H-01: Word Counting Logic]
export interface KeywordDensity {
  word: string;
  count: number;
  percentage: string;
}

export interface WordStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
  keywordDensity: KeywordDensity[];
}

export function useWordCounter() {
  const [text, setText] = useState<string>('');

  const stats = useMemo((): WordStats => {
    if (!text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMin: 0,
        keywordDensity: [],
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    
    // Words
    const wordsArray = text.trim().split(/\s+/).filter((w) => w.length > 0);
    const words = wordsArray.length;

    // Sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // Paragraphs
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading time (average 200 words per minute)
    const readingTimeMin = Math.ceil(words / 200);

    // Keyword Density
    const stopWords = new Set(['the', 'is', 'in', 'at', 'of', 'on', 'and', 'a', 'to', 'for', 'with', 'as', 'by', 'an', 'this', 'that', 'it', 'are', 'or', 'be']);
    const wordCounts: Record<string, number> = {};
    
    wordsArray.forEach((w) => {
      const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });

    const densityArray = Object.entries(wordCounts)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / words) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 keywords

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMin,
      keywordDensity: densityArray,
    };
  }, [text]);

  return {
    text,
    setText,
    stats,
  };
}
