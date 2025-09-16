import { faker } from "@faker-js/faker";
import { Invoice_Status, Submission_Status, type Invoice } from "../components";
import type { RouteHandler } from "miragejs/server";
import { Response, type Registry } from "miragejs";
import type { ModelRegistry } from "./MirageModels";

export function createOrGetInvoice(): Invoice {
  return {
    clientId: "all",
    clientName: faker.company.name(),
    id: faker.database.mongodbObjectId(),
    price: {
      currency: ["$", "₹", "€"][faker.number.int({ min: 0, max: 2 })],
      value: faker.number.int({ min: 25000, max: 500000 }),
    },
    // @ts-ignore
    status:
      Object.keys(Invoice_Status)[
        faker.number.int({
          min: 0,
          max: Object.keys(Invoice_Status).length - 1,
        })
      ],
    submissionStatus: [Submission_Status.DRAFT, Submission_Status.PUBLISHED][
      faker.number.int({ min: 0, max: 1 })
    ],
    date: faker.date
      .between({
        from: "2024-06-01T00:00:00.000Z",
        to: "2025-09-01T00:00:00.000Z",
      })
      .toISOString(),
  };
}

export const mockGetInvoices: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const { invoiceStatus = "all", submissionStatus = "all" } =
    request.queryParams;

  let data = schema.all("invoice").models.map((e) => e.attrs);

  if (invoiceStatus !== "all") {
    data = data.filter((inv: Invoice) => inv.status === invoiceStatus);
  }

  if (submissionStatus !== "all") {
    data = data.filter(
      (inv: Invoice) => inv.submissionStatus === submissionStatus
    );
  }

  const page = Number(request.queryParams.page) || 1;
  const limit = Number(request.queryParams.limit) || 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = data.slice(start, end);

  return {
    invoices: paginatedData,
    total: data.length,
    page,
    limit,
  };
};

export const mockPostInvoice: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const attrs = JSON.parse(request.requestBody);

  const newInvoice = schema.create("invoice", attrs);
  return newInvoice.attrs;
};

export const mockGetInvoice: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const invoiceId = request.params.id;
  const data = schema.find("invoice", invoiceId);
  return data?.attrs as any;
};

export const mockPutInvoice: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const id = request.params.id;
  const attrs = JSON.parse(request.requestBody);
  const invoice = schema.find("invoice", id);

  if (!invoice) {
    return new Response(404, {}, { error: "Invoice not found" });
  }

  invoice.update(attrs);
  return invoice.attrs;
};
