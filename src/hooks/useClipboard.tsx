import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useApp();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Failed to copy", "error");
    }
  };

  return { copied, copyToClipboard };
};