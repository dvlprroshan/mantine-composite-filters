import type { FilterDefinition, FilterOperator } from "../types/filter.types";

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  "=": "is",
  "!=": "is not",
  ">": "more than",
  "<": "less than",
  ">=": "at least",
  "<=": "at most",
  contains: "contains",
  starts_with: "starts with",
  ends_with: "ends with",
  between: "between",
};

export const OPERATOR_SYMBOLS: Record<FilterOperator, string> = {
  "=": ":",
  "!=": "≠",
  ">": ">",
  "<": "<",
  ">=": "≥",
  "<=": "≤",
  contains: "~",
  starts_with: "^",
  ends_with: "$",
  between: "↔",
};

export const getOperatorLabel = (operator: FilterOperator): string => {
  return OPERATOR_LABELS[operator];
};

export const getOperatorSymbol = (operator: FilterOperator): string => {
  return OPERATOR_SYMBOLS[operator];
};

export const getDefaultOperator = (type: FilterDefinition["type"]): FilterOperator => {
  switch (type) {
    case "date_range":
      return "between";
    case "text":
    case "email":
      return "contains";
    default:
      return "=";
  }
};

export const getOperatorsForField = (field: FilterDefinition): FilterOperator[] => {
  return field.operators || [getDefaultOperator(field.type)];
};

