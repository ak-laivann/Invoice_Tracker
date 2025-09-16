import { useParams } from "react-router-dom";
import { AsyncUIWrapper, InvoiceForm } from "../components";
import { useAddInvoice, useEditInvoice, useGetInvoice } from "../hooks";

export const AddInvoicePage = () => {
  const { mutate, isPending } = useAddInvoice();

  return (
    <InvoiceForm
      mode={"CREATE"}
      onSubmit={(data) => mutate(data)}
      disabled={isPending}
    />
  );
};

export const EditInvoicePage = () => {
  const id = useParams()?.id;

  const { data, isLoading, isError, error } = useGetInvoice(id);
  const { mutate, isPending } = useEditInvoice(id);

  return (
    <AsyncUIWrapper isLoading={isLoading} isError={isError} error={error}>
      <InvoiceForm
        mode="UPDATE"
        disabled={isPending}
        onSubmit={(data) => mutate(data)}
        initialValues={data ?? {}}
      />
    </AsyncUIWrapper>
  );
};
