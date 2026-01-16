/* eslint-disable no-console */
import { useState, useCallback, useEffect, useRef } from "react";
import type { StorageAdapter } from "./types";
import { createLocalStorageAdapter } from "./localStorageAdapter";

export interface UseStorageStateOptions<T> {
  adapter?: StorageAdapter<T>;
  storageKey?: string;
  defaultValue: T;
}

export const useStorageState = <T>(
  options: UseStorageStateOptions<T>
): [T, (value: T | ((prev: T) => T)) => void] => {
  const { adapter, storageKey, defaultValue } = options;

  const resolvedAdapter = useRef<StorageAdapter<T> | null>(null);

  if (!resolvedAdapter.current) {
    if (adapter) {
      resolvedAdapter.current = adapter;
    } else if (storageKey) {
      resolvedAdapter.current = createLocalStorageAdapter<T>(storageKey, defaultValue);
    }
  }

  const [state, setStateInternal] = useState<T>(() => {
    if (!resolvedAdapter.current) {
      return defaultValue;
    }
    const result = resolvedAdapter.current.get();
    if (result instanceof Promise) {
      return defaultValue;
    }
    return result;
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!resolvedAdapter.current || isInitialized.current) {
      return;
    }

    const loadInitialValue = async () => {
      try {
        const result = resolvedAdapter.current!.get();
        const value = result instanceof Promise ? await result : result;
        setStateInternal(value);
        isInitialized.current = true;
      } catch (error) {
        console.warn("[mantine-composite-filters] Failed to load initial value:", error);
        isInitialized.current = true;
      }
    };

    const result = resolvedAdapter.current.get();
    if (result instanceof Promise) {
      loadInitialValue();
    } else {
      isInitialized.current = true;
    }
  }, []);

  const setState = useCallback((value: T | ((prev: T) => T)) => {
    setStateInternal((prevState) => {
      const newValue = typeof value === "function" 
        ? (value as (prev: T) => T)(prevState) 
        : value;

      if (resolvedAdapter.current) {
        const result = resolvedAdapter.current.set(newValue);
        if (result instanceof Promise) {
          result.catch((error) => {
            console.warn("[mantine-composite-filters] Failed to persist state:", error);
          });
        }
      }

      return newValue;
    });
  }, []);

  return [state, setState];
};
