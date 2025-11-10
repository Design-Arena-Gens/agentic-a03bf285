'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(key);
      if (cached) {
        setState(JSON.parse(cached));
      }
    } catch (error) {
      console.warn("Nie udało się odczytać stanu z localStorage", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Nie udało się zapisać stanu do localStorage", error);
    }
  }, [key, state]);

  return [state, setState];
}
