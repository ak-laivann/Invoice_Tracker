import type { RouteHandler } from "miragejs/server";
import type { Registry } from "miragejs";
import type { ModelRegistry } from "./MirageModels";
import { Invoice_Status } from "../components";

export const mockGetDashboardMetrics: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const invoices: any[] = schema.all("invoice").models.map((e) => e.attrs);

  const fromDateParam = request.queryParams.fromDate as string;
  const toDateParam = request.queryParams.toDate as string;

  const fromDate = fromDateParam ? new Date(fromDateParam) : null;
  const toDate = toDateParam ? new Date(toDateParam) : null;

  const filteredInvoices = invoices.filter((inv) => {
    if (!inv.date) return false;
    const invDate = new Date(inv.date);

    if (fromDate && invDate < fromDate) return false;
    if (toDate && invDate > toDate) return false;

    return true;
  });

  const totalEarnings = filteredInvoices
    .filter((i) => i.status === Invoice_Status.PAID)
    .reduce((sum, i) => sum + i.price.value, 0);

  const paymentAwaited = filteredInvoices
    .filter((i) => i.status === Invoice_Status.AWAITED)
    .reduce((sum, i) => sum + i.price.value, 0);

  const paymentOverdue = filteredInvoices
    .filter((i) => i.status === Invoice_Status.OVERDUE)
    .reduce((sum, i) => sum + i.price.value, 0);

  const dashboard: { month: string; paid: number; momGrowth: number }[] = [];
  let prevMonthEarnings = 0;

  if (fromDate && toDate) {
    const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

    let cur = new Date(start);

    while (cur <= end) {
      const monthStr = cur.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const monthPaid = filteredInvoices
        .filter((inv) => {
          const invDate = new Date(inv.date!);
          return (
            inv.status === Invoice_Status.PAID &&
            invDate.getFullYear() === cur.getFullYear() &&
            invDate.getMonth() === cur.getMonth()
          );
        })
        .reduce((sum, i) => sum + i.price.value, 0);

      const momGrowth =
        prevMonthEarnings === 0
          ? 0
          : ((monthPaid - prevMonthEarnings) / prevMonthEarnings) * 100;
      prevMonthEarnings = monthPaid;

      dashboard.push({
        month: monthStr,
        paid: monthPaid,
        momGrowth: parseFloat(momGrowth.toFixed(2)),
      });

      cur.setMonth(cur.getMonth() + 1);
    }
  }

  return {
    totalEarnings,
    paymentAwaited,
    paymentOverdue,
    dashboard,
  };
};
