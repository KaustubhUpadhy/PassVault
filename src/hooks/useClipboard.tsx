import { useState } from 'react';

export const useClipboard = (showToast: (message: string, type?: 'success' | 'error' | 'info') => void) => {
  const [copied, setCopied] = useState(false);

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