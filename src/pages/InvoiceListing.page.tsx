import { useInvoiceListing } from "../hooks";
import {
  AsyncUIWrapper,
  InvoiceListingComponent,
  Pagination,
} from "../components";
import { useState } from "react";

export const InvoiceListingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, isError, error, data } = useInvoiceListing(currentPage);
  return (
    <>
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
