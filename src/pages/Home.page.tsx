import { DashboardPage } from "./Dashboard.page";
import { InvoiceListingPage } from "./InvoiceListing.page";
import { Header } from "../components";
import { faker } from "@faker-js/faker";
import { CreateInvoiceCard } from "./CreateInvoiceCard.page";
import { useState } from "react";

export const HomePage = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  return (
    <>
      {/* This avatar URL could be obtained from backend - while using Login and this faker url can be replaced with that */}
      <Header avatarUrl={faker.image.url()} />
      <br />
      <CreateInvoiceCard
        onBatchUploadSuccess={() => setRefetchTrigger((prev) => !prev)}
      />
      <br />
      <DashboardPage />
      <br />
      <InvoiceListingPage refetchTrigger={refetchTrigger} />
    </>
  );
};
