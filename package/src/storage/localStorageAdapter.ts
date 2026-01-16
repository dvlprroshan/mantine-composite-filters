/* eslint-disable no-console */
import type { StorageAdapter } from "./types";

const isDateString = (value: unknown): boolean => {
  if (typeof value !== "string") {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes("T");
};

const serializeValue = <T>(value: T): string => {
  return JSON.stringify(value, (_key, val) => {
    if (val instanceof Date) {
      return { __type: "Date", value: val.toISOString() };
    }
    return val;
  });
};

const deserializeValue = <T>(text: string): T => {
  return JSON.parse(text, (_key, val) => {
    if (val && typeof val === "object" && val.__type === "Date" && val.value) {
      return new Date(val.value);
    }
    if (isDateString(val)) {
      return new Date(val);
    }
    return val;
  });
};

export const createLocalStorageAdapter = <T>(
  key: string,
  defaultValue: T
): StorageAdapter<T> => {
  return {
    get: (): T => {
      if (typeof window === "undefined") {
        return defaultValue;
      }
      try {
        const item = window.localStorage.getItem(key);
        if (item === null) {
          return defaultValue;
        }
        return deserializeValue<T>(item);
      } catch (error) {
        console.warn(
          `[mantine-composite-filters] Failed to read from localStorage key "${key}":`,
          error
        );
        return defaultValue;
      }
    },

    set: (value: T): void => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        const serialized = serializeValue(value);
        window.localStorage.setItem(key, serialized);
      } catch (error) {
        console.warn(
          `[mantine-composite-filters] Failed to write to localStorage key "${key}":`,
          error
        );
      }
    },

    remove: (): void => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(
          `[mantine-composite-filters] Failed to remove localStorage key "${key}":`,
          error
        );
      }
    },
  };
};
