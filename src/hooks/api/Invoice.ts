import { useFetchData } from "../useFetch";

export function useInvoiceListing(
  page: number = 1,
  invoiceStatus: string,
  submissionStatus: string
) {
  const queryParams: Record<string, string> = {
    page: page.toString(),
    limit: Number(10).toString(),
    invoiceStatus,
    submissionStatus,
  };
  return useFetchData<any>(
    [
      "invoice_listing",
      page,
      JSON.stringify(queryParams),
      invoiceStatus,
      submissionStatus,
    ],
    `clients/all/invoice_listing?${new URLSearchParams(queryParams).toString()}`
  );
}

export function useDashboardMetrics(fromDate: string, toDate: string) {
  const queryParams: Record<string, string> = { fromDate, toDate };
  return useFetchData<any>(
    ["dashboard metrics", fromDate, toDate, JSON.stringify(queryParams)],
    `dashboardMetrics?${new URLSearchParams(queryParams).toString()}`
  );
}
