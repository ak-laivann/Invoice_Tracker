import { Button, Tabs } from "antd";
import {
  InvoiceFilterBar,
  AsyncUIWrapper,
  Pagination,
  InvoiceCard,
  Submission_Status,
  type Invoice,
} from "../components";
import { useChangeStatus, useInvoiceListing } from "../hooks";
import { useEffect, useState } from "react";
import { Excel } from "antd-table-saveas-excel";
import type { IExcelColumn } from "antd-table-saveas-excel/app";

export const InvoiceListingPage = (props: { refetchTrigger: boolean }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceStatus, setInvoiceStatus] = useState("all");
  const [submissionStatus, setSubmissionStatus] = useState("all");

  const { isLoading, isError, error, data, refetch } = useInvoiceListing(
    currentPage,
    invoiceStatus,
    submissionStatus
  );

  const [id, setId] = useState<string>("");
  const { mutate } = useChangeStatus(id);

  useEffect(() => {
    refetch();
  }, [props.refetchTrigger]);

  const submissionTabs = [
    { label: "All", key: "all" },
    ...Object.values(Submission_Status).map((status) => ({
      label: status,
      key: status,
    })),
  ];

  return (
    <>
      <h1 className="text-[var(--text-color)]">Your Invoices</h1>
      <br />
      <InvoiceFilterBar
        onChange={(val) => {
          setInvoiceStatus(val.status);
          setSubmissionStatus(val.submission);
        }}
      />

      <Tabs
        className="p-2"
        items={submissionTabs.map((tab) => ({
          label: tab.label,
          key: tab.key,
        }))}
        defaultActiveKey="all"
        onChange={(key) => {
          setSubmissionStatus(key);
        }}
        tabBarExtraContent={{
          right: (
            <Button
              onClick={() => {
                onDownload({ data: data?.invoices, sheetName: invoiceStatus });
              }}
            >
              Download as Excel
            </Button>
          ),
        }}
      />
      <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.invoices?.map((invoice) => (
            <InvoiceCard
              key={invoice?.id}
              data={invoice}
              onStatusChange={(id, status) => {
                setId(id);
                mutate({ status });
              }}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            total={data?.total ?? 0}
          />
        </div>
      </AsyncUIWrapper>
    </>
  );
};

const onDownload = ({
  data,
  sheetName,
}: {
  data: Invoice[];
  sheetName: string;
}) => {
  if (!data || data.length === 0) return;

  const excel = new Excel();

  const excelColumns: IExcelColumn[] = [
    { title: "Invoice ID", dataIndex: "id" },
    { title: "Client Id", dataIndex: "clientId" },
    { title: "Client Name", dataIndex: "clientName" },
    { title: "Currency", dataIndex: ["price", "currency"] },
    { title: "Value", dataIndex: ["price", "value"] },
    { title: "Date", dataIndex: "date" },
    { title: "Status", dataIndex: "status" },
    { title: "Submission Status", dataIndex: "submissionStatus" },
  ];

  excel
    .addSheet(sheetName || "Invoices")
    .addColumns(excelColumns)
    .addDataSource(data);

  const date = new Date();
  excel.saveAs(
    `Invoices-${sheetName}-${date.toLocaleDateString()}-${date
      .toLocaleTimeString()
      .replace(/:/g, "-")}.xlsx`
  );
};
