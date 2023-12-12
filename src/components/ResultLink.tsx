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
  const relatedSearchString = relatedSearch;
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
      {...splitRelatedSearchStrings.reduce<JSX.Element[]>(
        (accumulator, current, index) => {
          const inputtedValueSpanElement = (
            <span
              className="inputValueInRelatedSearchSpan"
              key={`${index}span`}
            >
              {lastInputtedValue}
            </span>
          );
          //using div and styling to inline so first unbolded value can be selecte with the use of :first-of-type css selector
          const boldedValueDivElement = (
            <div className="boldedValueDivElement" key={`${index}div`}>
              {current}
            </div>
          );
          if (index === splitRelatedSearchStrings.length - 1)
            return [...accumulator, boldedValueDivElement];
          return [
            ...accumulator,
            boldedValueDivElement,
            inputtedValueSpanElement,
          ];
        },
        []
      )}
    </a>
  );
};
