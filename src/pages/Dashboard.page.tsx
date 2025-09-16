import {
  AsyncUIWrapper,
  DashboardMetricsCard,
  MoMInvoiceChart,
  TimePeriodSelector,
} from "../components";
import { useDashboardMetrics } from "../hooks";
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

export const DashboardPage = () => {
  const [period, setPeriod] = useState<"1M" | "3M" | "1Y" | "CUSTOM">("1M");
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const to = new Date();
    const from = subtractMonths(to, 1);
    return [from, to];
  });

  const { isLoading, isError, error, data } = useDashboardMetrics(
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
      <h1 className="text-black">Dashboard</h1>
      <br />
      <TimePeriodSelector value={period} onChange={handlePeriodChange} />
      <br />
      <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
        <DashboardMetricsCard
          paymentAwaited={data?.paymentAwaited}
          paymentOverDue={data?.paymentOverdue}
          totalEarnings={data?.totalEarnings}
        />
        <MoMInvoiceChart data={data?.dashboard} />
      </AsyncUIWrapper>
    </>
  );
};
