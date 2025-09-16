import { Navigate, Route, Routes } from "react-router-dom";
import { InvoiceListingPage } from "../pages";

export const RootRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"/invoice_listing"} />} />
      <Route path="/invoice_listing" element={<InvoiceListingPage />} />
    </Routes>
  );
};
