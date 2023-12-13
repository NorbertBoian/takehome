export const getRelatedSearches = async (
  query: string,
  signal?: AbortSignal
) => {
  const fetchOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify({
      query,
    }),
  };
  const response = await fetch(
    `/api/getRelatedSearches`,
    signal ? { ...fetchOptions, signal } : fetchOptions
  );
  const parsedResponse = await response.json();
  return parsedResponse;
};
