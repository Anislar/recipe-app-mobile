import { QueryClient } from "@tanstack/react-query";

type MutationType = "update" | "update_unique" | "add" | "delete";

type Updater<T> = Partial<T> | ((item: T) => T);

interface PatchQueryyParams<T> {
  queryClient: QueryClient;
  key: string[];
  type: MutationType;
  matchId?: string | number;
  newItem?: Updater<T>;
}

export function patchQuery<T extends { id: string | number }>({
  queryClient,
  key,
  type,
  matchId,
  newItem,
}: PatchQueryyParams<T>) {
  matchId = parseInt(matchId as string, 10);
  const cachedData = queryClient.getQueryData<any>(key);
  if (!cachedData) return [];
  queryClient.setQueryData(key, (old: any) => {
    if (!old) return old;
    if (type === "update_unique" && typeof newItem === "function") {
      return {
        ...old,
        ...(newItem as (i: T) => T)(old),
      };
    }
    return {
      ...old,
      pages: old.pages.map((page: any, index: number) => {
        const results: T[] = page.data?.results ?? [];

        let updatedResults = results;
        let total = parseInt(page.data.pagination.totalItems, 10);
        switch (type) {
          case "update":
            updatedResults = results.map((item) => {
              if (item.id !== matchId) return item;

              if (typeof newItem === "function") {
                return (newItem as (i: T) => T)(item);
              }
              return { ...item, ...(newItem as Partial<T>) };
            });
            break;

          case "add":
            if (index === 0) {
              updatedResults = [newItem as T, ...results];
              total += 1;
            }
            break;

          case "delete":
            updatedResults = results.filter((item) => item.id !== matchId);
            total -= 1;
            break;

          default:
            updatedResults = results;
        }

        return {
          ...page,
          data: {
            ...page.data,
            results: updatedResults,
            pagination: {
              ...page.data.pagination,
              totalItems: total,
            },
          },
        };
      }),
    };
  });
}
