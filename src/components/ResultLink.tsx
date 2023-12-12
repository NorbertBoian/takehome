import { relatedSearch } from "./SearchBar";

type Props = {
  relatedSearch: relatedSearch;
  resultIndex: number;
  hovered: number;
  lastInputtedValue: string;
};

export const ResultLink = ({
  relatedSearch,
  resultIndex,
  lastInputtedValue,
  hovered,
}: Props) => {
  const relatedSearchString = relatedSearch.phrase;
  const splitRelatedSearchStrings =
    relatedSearchString.split(lastInputtedValue);

  return (
    <a
      className="searchResult"
      href={`https://www.google.com/search?q=${relatedSearchString}`}
      target="_blank"
      id={`list-${resultIndex}`}
      role="option"
      key={resultIndex}
      data-hovered={hovered === resultIndex}
      data-index={resultIndex}
      data-related-string={relatedSearchString}
      tabIndex={-1}
      data-combobox
    >
      {...splitRelatedSearchStrings.reduce<(string | JSX.Element)[]>(
        (accumulator, current, index) => {
          const valueSpanElement = (
            <span className="inputValueInRelatedSearchSpan" key={index}>
              {lastInputtedValue}
            </span>
          );
          if (index === splitRelatedSearchStrings.length - 1)
            return [...accumulator, <span key={index}>{current}</span>];
          return [...accumulator, current, valueSpanElement];
        },
        []
      )}
    </a>
  );
};
