import { Card } from "antd";
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

function getMonthDifference(from: Date, to: Date): number {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth()) +
    1
  );
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

  const numMonths = getMonthDifference(dateRange[0], dateRange[1]);

  return (
    <>
      <h1 className="text-[var(--text-color)]">Dashboard</h1>
      <br />
      <TimePeriodSelector value={period} onChange={handlePeriodChange} />
      <br />
      <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
        <DashboardMetricsCard
          paymentAwaited={data?.paymentAwaited}
          paymentOverDue={data?.paymentOverdue}
          totalEarnings={data?.totalEarnings}
        />
        <br />
        <Card>
          <div style={{ fontWeight: "bold" }}>Income Trend</div>
          <div className="text-[#8134AF]" style={{ fontSize: "1.5rem" }}>
            Your monthly income and growth for the last {numMonths} months
          </div>
          <MoMInvoiceChart data={data?.dashboard} />
        </Card>
      </AsyncUIWrapper>
    </>
  );
};
