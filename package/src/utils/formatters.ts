import type { FilterDefinition } from "../types/filter.types";
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconFilter,
  IconSearch,
} from "@tabler/icons-react";
import React from "react";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateRange = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return "";
  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const toDate = (val: Date | string | null): Date | null => {
  if (!val) return null;
  if (typeof val === "string") return new Date(val);
  return val;
};

export const getFieldIcon = (
  type: FilterDefinition["type"],
  size: number = 14
): React.ReactNode => {
  const iconProps = { size, style: { color: 'var(--mantine-color-gray-6)' } };
  
  const icons: Record<string, React.ReactNode> = {
    text: React.createElement(IconSearch, iconProps),
    email: React.createElement(IconFilter, iconProps),
    number: React.createElement(IconFilter, iconProps),
    date: React.createElement(IconCalendar, iconProps),
    date_range: React.createElement(IconCalendar, iconProps),
    select: React.createElement(IconChevronDown, iconProps),
    multi_select: React.createElement(IconCheck, iconProps),
  };
  
  return icons[type] || React.createElement(IconFilter, iconProps);
};

