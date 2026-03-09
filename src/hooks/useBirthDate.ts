import React, { createContext, useContext, useState, useCallback } from "react";

interface BirthDateContextValue {
  birthDate: string | null;
  setBirthDate: (date: string | null) => void;
  clearBirthDate: () => void;
}

const STORAGE_KEY = "userBirthDate";

const BirthDateContext = createContext<BirthDateContextValue | null>(null);

export const BirthDateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [birthDate, setBirthDateState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const setBirthDate = useCallback((date: string | null) => {
    setBirthDateState(date);
    try {
      if (date) {
        localStorage.setItem(STORAGE_KEY, date);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const clearBirthDate = useCallback(() => {
    setBirthDate(null);
  }, [setBirthDate]);

  return React.createElement(
    BirthDateContext.Provider,
    { value: { birthDate, setBirthDate, clearBirthDate } },
    children
  );
};

export function useBirthDate(): BirthDateContextValue {
  const context = useContext(BirthDateContext);
  if (!context) {
    throw new Error("useBirthDate must be used within a BirthDateProvider");
  }
  return context;
}
