import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages";
import {
  AddInvoicePage,
  EditInvoicePage,
} from "../pages/AddOrEditInvoice.page";

export const RootRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={"/home"} />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/invoices/add" element={<AddInvoicePage />} />
      <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />
    </Routes>
  );
};
