import { useDashboardMetrics, useInvoiceListing } from "../hooks";
import {
  AsyncUIWrapper,
  DashboardMetricsCard,
  Invoice_Status,
  InvoiceFilterBar,
  InvoiceListingComponent,
  MoMInvoiceChart,
  Pagination,
  TimePeriodSelector,
} from "../components";
import { useState } from "react";

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

function subtractYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() - years);
  return d;
}

export const InvoiceListingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceStatus, setInvoiceStatus] = useState("all");
  const [submissionStatus, setSubmissionStatus] = useState("all");

  const [period, setPeriod] = useState<"1M" | "3M" | "1Y" | "CUSTOM">("1M");
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const to = new Date();
    const from = subtractMonths(to, 1);
    return [from, to];
  });

  const { isLoading, isError, error, data } = useInvoiceListing(
    currentPage,
    invoiceStatus,
    submissionStatus
  );
  const {
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
    data: dashboardData,
  } = useDashboardMetrics(
    dateRange[0].toISOString(),
    dateRange[1].toISOString()
  );

  const handlePeriodChange = (
    val: "1M" | "3M" | "1Y" | "CUSTOM",
    range?: [Date, Date]
  ) => {
    setPeriod(val);
    const now = new Date();

    if (val === "1M") {
      setDateRange([subtractMonths(now, 1), now]);
    } else if (val === "3M") {
      setDateRange([subtractMonths(now, 3), now]);
    } else if (val === "1Y") {
      setDateRange([subtractYears(now, 1), now]);
    } else if (val === "CUSTOM" && range) {
      setDateRange(range);
    }
  };

  return (
    <>
      <TimePeriodSelector value={period} onChange={handlePeriodChange} />
      <br />
      <AsyncUIWrapper
        isLoading={isDashboardLoading}
        isError={isDashboardError}
        error={dashboardError}
      >
        <DashboardMetricsCard
          paymentAwaited={dashboardData?.paymentAwaited}
          paymentOverDue={dashboardData?.paymentOverdue}
          totalEarnings={dashboardData?.totalEarnings}
        />
        <MoMInvoiceChart data={dashboardData?.dashboard} />
      </AsyncUIWrapper>
      <br />
      <h1 className="text-black">Your Invoices</h1>
      <br />
      <InvoiceFilterBar
        onChange={(val) => {
          setInvoiceStatus(val.status);
          setSubmissionStatus(val.submission);
        }}
      />

      <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
        <InvoiceListingComponent
          invoices={data?.invoices ?? []}
          onStatusChange={(id, status) => console.log(id, status)}
        />
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
