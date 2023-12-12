import { useCallback, useMemo, useState } from "react";
import { relatedSearch } from "../components/SearchBar";
import { getRelatedSearches } from "../components/getRelatedSearches";
import { getThrottledAndDebouncedFunction } from "../components/getThrottledAndDebouncedFunction";

export const useRelatedSearches = () => {
  const [relatedSearches, setRelatedSearches] = useState<relatedSearch[]>([]);

  const getAndSetRelatedSearches = useCallback(
    async (query: string, signal?: AbortSignal) => {
      try {
        if (query) {
          const relatedSearchesResult = await getRelatedSearches(query, signal);
          setRelatedSearches(relatedSearchesResult);
        }
      } catch (err) {
        // if (err !== "intended") console.log(err);
      }
    },
    []
  );

  const rateLimitedGetAndSetRelatedSearches = useMemo(
    () => getThrottledAndDebouncedFunction(getAndSetRelatedSearches, 75),
    [getAndSetRelatedSearches]
  );

  const clearRelatedSearches = () => setRelatedSearches([]);

  return [
    relatedSearches,
    rateLimitedGetAndSetRelatedSearches,
    clearRelatedSearches,
  ] as const;
};
