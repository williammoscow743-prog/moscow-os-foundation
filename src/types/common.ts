/** Shared, framework-agnostic types used across features. */

export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface Timestamped {
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";
