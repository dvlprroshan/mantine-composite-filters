import type { FilterHistory, SavedFilterPreset } from "../types/filter.types";

export interface StorageAdapter<T> {
  get: () => T | Promise<T>;
  set: (value: T) => void | Promise<void>;
  remove: () => void | Promise<void>;
}

export interface FilterHistoryStorageAdapter extends StorageAdapter<FilterHistory[]> {}

export interface FilterPresetsStorageAdapter extends StorageAdapter<SavedFilterPreset[]> {}

export interface StorageAdapterFactory {
  createHistoryAdapter: (key: string) => FilterHistoryStorageAdapter;
  createPresetsAdapter: (key: string) => FilterPresetsStorageAdapter;
}

export interface UseStorageAdapterOptions<T> {
  adapter?: StorageAdapter<T>;
  storageKey?: string;
  defaultValue: T;
}
