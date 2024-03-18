import { Row } from "@tanstack/react-table";

export const FilterOneInclude = (row: Row<any>, id: string, value: any) => {
  return (
    value instanceof Array &&
    value.some((value) => String(row.getValue(id)).includes(value))
  );
};

export const FilterAllInclude = (row: Row<any>, id: string, value: any) => {
  return (
    value instanceof Array &&
    value.every((value) => String(row.getValue(id)).includes(value))
  );
};
