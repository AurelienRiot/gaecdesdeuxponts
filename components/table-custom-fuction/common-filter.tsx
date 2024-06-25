import type { Row } from "@tanstack/react-table";

// biome-ignore lint/suspicious/noExplicitAny:
export const FilterOneInclude = (row: Row<any>, id: string, value: any) => {
  return Array.isArray(value) && value.some((value) => String(row.getValue(id)).includes(value));
};

// biome-ignore lint/suspicious/noExplicitAny:
export const FilterAllInclude = (row: Row<any>, id: string, value: any) => {
  return Array.isArray(value) && value.every((value) => String(row.getValue(id)).includes(value));
};
