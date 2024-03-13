import { Row } from "@tanstack/react-table";

export const FilterFn = (row: Row<any>, id: string, value: any) => {
  return value instanceof Array && value.includes(String(row.getValue(id)));
};
