import { useState } from 'react';
import { PasswordSettings } from '../types';

export const usePasswordSettings = () => {
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const updateSettings = (newSettings: Partial<PasswordSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};
