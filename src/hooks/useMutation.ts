import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useMutateData = <Data, T>(
  url: string | ((variables: T) => string),
  options?: Omit<UseMutationOptions<Data, Error, T>, "mutationFn">,
  method?: string
) => {
  return useMutation<Data, Error, T>({
    mutationFn: async (variables: T) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;
      const res = await fetch(`/api/v1/${resolvedUrl}`, {
        method: method ?? "POST",
        headers: {
          "Content-Type": "application/json",
          useMirage: "true",
        },
        body: JSON.stringify(variables),
      });
      if (!res.ok) throw new Error(`Mutation error: ${res.status}`);
      return (await res.json()) as Data;
    },
    ...options,
  });
};
