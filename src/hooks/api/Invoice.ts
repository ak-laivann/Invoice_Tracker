import { toast } from "react-toastify";
import { useFetchData } from "../useFetch";
import { useMutateData } from "../useMutation";
import type { Invoice } from "../../components";
import { useNavigate } from "react-router-dom";

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

export function useAddInvoice() {
  const navigate = useNavigate();
  const mutation = useMutateData<Invoice, {}>("invoices", {
    onSuccess: () => {
      toast.success("Invoice Added successfully");
      navigate("/home");
    },
    onError: () => {
      toast.error("Failed to add invoice");
    },
  });

  return mutation;
}

export function useGetInvoice(id: string) {
  return useFetchData<Invoice>(["invoice"], `invoices/${id}`);
}

export function useEditInvoice(id: string) {
  const navigate = useNavigate();
  return useMutateData(
    `invoices/${id}`,
    {
      onSuccess: () => {
        toast.success("Invoice edited successfully");
        navigate("/home");
      },
      onError: () => {
        toast.error("Failed to update invoice");
      },
    },
    "PUT"
  );
}

export function useBatchPostInvoice(
  setIsModalOpen: any,
  setFileList: any,
  onSuccess: () => void
) {
  return useMutateData<Invoice[], {}>("invoices/batch", {
    onSuccess: () => {
      toast.success("Invoices uploaded successfully");
      setIsModalOpen(false);
      setFileList([]);
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to upload invoices, ${error.message}`);
    },
  });
}

export function useChangeStatus(id: string) {
  const navigate = useNavigate();
  return useMutateData(
    `invoices/${id}/changeStatus`,
    {
      onSuccess: () => {
        toast.success("Invoice edited successfully");
        navigate("/home");
      },
      onError: () => {
        toast.error("Failed to update invoice");
      },
    },
    "PUT"
  );
}
