import type { VercelRequest, VercelResponse } from "@vercel/node";
import { decode } from "html-entities";

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
  try {
    const fetchResponse = await fetch(
      `https://www.google.com/complete/search?q=${percentEncodedQueryWithPlusSign}&cp=7&client=gws-wiz-serp&xssi=t`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ro;q=0.7",
          "sec-ch-ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          "sec-ch-ua-arch": '"x86"',
          "sec-ch-ua-bitness": '"64"',
          "sec-ch-ua-full-version": '"120.0.6099.71"',
          "sec-ch-ua-full-version-list":
            '"Not_A Brand";v="8.0.0.0", "Chromium";v="120.0.6099.71", "Google Chrome";v="120.0.6099.71"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-model": '""',
          "sec-ch-ua-platform": '"Windows"',
          "sec-ch-ua-platform-version": '"10.0.0"',
          "sec-ch-ua-wow64": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          Referer: "https://www.google.com/",
          "Referrer-Policy": "origin",
        },
        body: null,
        method: "GET",
      }
    );

    const textResponse = await fetchResponse.text();
    const textResponseWithoutWeirdCharacters = textResponse
      .replace(/^\)]}'\n\[/, "")
      .replace(/]],{".*/, "]]");
    const relatedSearchesGoogleFormated = JSON.parse(
      textResponseWithoutWeirdCharacters
    );
    const relatedStrings = relatedSearchesGoogleFormated.map(
      (relatedSearch: [string, unknown, unknown]) =>
        decode(relatedSearch[0].replaceAll("<b>", "").replaceAll("</b>", ""))
    );
    return response.json(relatedStrings);
  } catch (err) {
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
    const parsedResponse = (
      (await fetchResponse.json()) as { phrase: string }[]
    ).map((relatedSearch) => relatedSearch.phrase);
    return response.status(200).json(parsedResponse);
  }
}
