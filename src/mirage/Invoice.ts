import { faker } from "@faker-js/faker";
import { Invoice_Status, Submission_Status, type Invoice } from "../components";
import type { RouteHandler } from "miragejs/server";
import type { Registry } from "miragejs";
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
    date: faker.date.recent({ days: 10 }).toISOString(),
  };
}

export const mockGetInvoices: RouteHandler<
  Registry<typeof ModelRegistry, any>
> = (schema, request) => {
  const data = schema.all("invoice").models.map((e) => e.attrs);

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
