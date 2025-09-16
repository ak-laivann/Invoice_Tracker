import { useFetchData } from "../useFetch";

export function useInvoiceListing(page: number = 1) {
  const queryParams: Record<string, string> = {
    page: page.toString(),
    limit: Number(10).toString(),
  };
  return useFetchData<any>(
    ["invoice_listing", page],
    `clients/all/invoice_listing?${new URLSearchParams(queryParams).toString()}`
  );
}
