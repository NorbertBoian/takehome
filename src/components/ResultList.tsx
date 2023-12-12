import { forwardRef, MouseEvent } from "react";
import { ResultLink } from "./ResultLink";
import { relatedSearch } from "./SearchBar";

type Props = {
  relatedSearches: relatedSearch[];
  hovered: number;
  lastInputtedValue: string;
  hoverHandler: (event: MouseEvent<HTMLDivElement>) => void;
  handleSearchResultClick: () => void;
};
export const ResultList = forwardRef<HTMLDivElement, Props>(
  (
    {
      relatedSearches,
      hoverHandler,
      handleSearchResultClick,
      lastInputtedValue,
      hovered,
    },
    ref
  ) => {
    return (
      <div
        onMouseOver={hoverHandler}
        onClick={handleSearchResultClick}
        className="searchResultsContainer"
        id="listbox"
        role="listbox"
        aria-label="Related Searches"
        ref={ref}
      >
        {relatedSearches.length
          ? relatedSearches.map((relatedSearch, resultIndex) => (
              <ResultLink
                relatedSearch={relatedSearch}
                resultIndex={resultIndex}
                hovered={hovered}
                lastInputtedValue={lastInputtedValue}
                key={resultIndex}
              />
            ))
          : lastInputtedValue &&
            Array.from({ length: 5 }, (_v, i) => (
              <div key={i} className="searchResult">
                Loading
              </div>
            ))}
      </div>
    );
  }
);
