import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  modifiersEnabled: boolean;
  setModifiersEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [modifiersEnabled, setModifiersEnabled] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('dicey-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSoundEnabled(settings.soundEnabled ?? true);
      setModifiersEnabled(settings.modifiersEnabled ?? true);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      soundEnabled,
      modifiersEnabled,
    };
    localStorage.setItem('dicey-settings', JSON.stringify(settings));
  }, [soundEnabled, modifiersEnabled]);

  return (
    <SettingsContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        modifiersEnabled,
        setModifiersEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};