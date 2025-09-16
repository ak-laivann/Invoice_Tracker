import { createServer, Response } from "miragejs";
import { ModelRegistry } from "./MirageModels";

export function makeServer() {
  return createServer({
    models: ModelRegistry,
    routes() {
      this.urlPrefix = `/api/v1`;
      this.timing = 3000;
      this.get("/testing", () => {
        return { WTF: "WTf" };
      });

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

    seeds(server) {},
  });
}
