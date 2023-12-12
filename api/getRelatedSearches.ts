import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { query } = JSON.parse(request.body);
  const percentEncodedQuery = encodeURIComponent(query);
  const percentEncodedQueryWithPlusSign = percentEncodedQuery.replace(
    "%20",
    "+"
  );
  const fetchResponse = await fetch(
    `https://duckduckgo.com/ac/?q=${percentEncodedQueryWithPlusSign}&kl=wt-wt`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ro;q=0.7",
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer: "https://duckduckgo.com/",
        "Referrer-Policy": "origin",
      },
      body: null,
      method: "GET",
    }
  );
  const parsedResponse = await fetchResponse.json();
  return response.status(200).json(parsedResponse);
}
