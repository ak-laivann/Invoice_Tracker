import { createServer } from "miragejs";
import { ModelRegistry } from "./MirageModels";
import {
  createOrGetInvoice,
  mockChangeStatus,
  mockGetInvoice,
  mockGetInvoices,
  mockPostBatchInvoices,
  mockPostInvoice,
  mockPutInvoice,
} from "./Invoice";
import { mockGetDashboardMetrics } from "./Dashboad";

export function makeServer() {
  return createServer({
    models: ModelRegistry,
    routes() {
      this.urlPrefix = `/api/v1`;
      this.timing = 3000;
      this.get("/clients/all/invoice_listing", mockGetInvoices);
      this.get("/dashboardMetrics", mockGetDashboardMetrics);

      this.put("/invoices/:id/changeStatus", mockChangeStatus);

      this.get("/invoices/:id", mockGetInvoice);
      this.post("/invoices", mockPostInvoice);
      this.put("/invoices/:id", mockPutInvoice);

      this.post("/invoices/batch", mockPostBatchInvoices);

      // this guy is useful in case we want to move to real api.
      // just set use mirage to false or remove it in the api call
      // and api calls will be made to the real api.
      // defaulting it to true so that we can use miragejs which can always be overwritten.
      this.passthrough(
        (request) =>
          !(
            request.queryParams?.useMirage === "true" ||
            request.requestHeaders?.useMirage === "true"
          )
      );
    },

    seeds(server) {
      for (let i = 1; i <= 27; i++) {
        server.create("invoice", createOrGetInvoice());
      }
    },
  });
}
