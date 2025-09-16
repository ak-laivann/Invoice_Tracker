import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useFetchData = <T>(
  queryKey: string | number | (string | number)[],
  url: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  return useQuery<T>({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await fetch(`/api/v1/${url}`, {
        headers: { useMirage: "true" },
      });

      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status}`);
      }

      return (await res.json()) as T;
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};
