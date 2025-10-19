import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ApiContextType {
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [apiUrl, setApiUrlState] = useState<string>(() => {
    return localStorage.getItem('apiUrl') || 'http://localhost:3000';
  });

  const setApiUrl = (url: string) => {
    localStorage.setItem('apiUrl', url);
    setApiUrlState(url);
  };

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};