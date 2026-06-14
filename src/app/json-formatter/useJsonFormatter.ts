import { useState } from 'react';
import JSON5 from 'json5';
// @ts-ignore
import JsonToTS from 'json-to-ts';

// [TL-JSON-H-01: JSON Formatting Logic (Pro)]
export function useJsonFormatter() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const formatJson = (spaces: number = 2) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      // Normal parse first to catch actual valid JSON
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  };

  const autoFixJson = (spaces: number = 2) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      // JSON5 can parse unquoted keys, trailing commas, comments, etc.
      const parsed = JSON5.parse(input);
      // Convert it back to strict JSON
      const strictJson = JSON.stringify(parsed, null, spaces);
      setInput(strictJson); // Update input to the fixed version
      setOutput(strictJson);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Could not Auto-Fix JSON. Syntax is too broken.');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  };

  const generateTsTypes = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      // Use JSON5 to be forgiving
      const parsed = JSON5.parse(input);
      const types = JsonToTS(parsed).join('\n\n');
      setOutput(types);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON for TS Generation');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      return true;
    } catch (err) {
      console.error('Failed to copy', err);
      return false;
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return {
    input,
    setInput,
    output,
    error,
    formatJson,
    autoFixJson,
    minifyJson,
    generateTsTypes,
    copyToClipboard,
    clearAll,
  };
}
