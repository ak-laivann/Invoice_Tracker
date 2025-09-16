import { DashboardPage } from "./Dashboard.page";
import { InvoiceListingPage } from "./InvoiceListing.page";

export const HomePage = () => {
  return (
    <>
      <DashboardPage />
      <br />
      <InvoiceListingPage />
    </>
  );
};
