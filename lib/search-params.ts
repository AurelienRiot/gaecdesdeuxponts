import type { ReadonlyURLSearchParams } from "next/navigation";

export function constructQueryString({
  newParamKey,
  newParamValue,
  searchParams,
}: { newParamKey: string; newParamValue: string; searchParams: ReadonlyURLSearchParams }) {
  const params = new URLSearchParams(searchParams.toString());
  params.set(newParamKey, newParamValue);
  return `?${params.toString()}`;
}
