import {
  ChangeEvent,
  useRef,
  useState,
  KeyboardEvent,
  MouseEvent,
  useEffect,
} from "react";
import "./SearchBar.css";
import { ResultList } from "./ResultList";
import { useRelatedSearches } from "../hooks/useRelatedSearches";

export type relatedSearch = string;

export const SearchBar = () => {
  const [value, setValue] = useState("");
  const [lastInputtedValue, setLastInputtedValue] = useState(value);
  const [visibleResultsList, setVisibleResultsList] = useState(false);
  const [hovered, setHovered] = useState(-1);

  const [
    relatedSearches,
    rateLimitedGetAndSetRelatedSearches,
    clearRelatedSearches,
  ] = useRelatedSearches();

  const prevAbortControllerRef = useRef(new AbortController());

  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsContainerRef = useRef<HTMLDivElement>(null);

  const relatedSearchesLength = relatedSearches.length;

  const closeResultsList = () => {
    setVisibleResultsList(false);
    setValue(lastInputtedValue);
    setHovered(-1);
  };
  const openResultsList = (newValue?: string) => {
    if (newValue !== undefined) return newValue && setVisibleResultsList(true);
    value && setVisibleResultsList(true);
  };

  const openHoveredLink = () => {
    const hoveredElement =
      searchResultsContainerRef.current?.children?.item(hovered);
    if (hoveredElement instanceof HTMLAnchorElement) hoveredElement.click();
  };

  const handleOnChange = async (
    eventOrString: ChangeEvent<HTMLInputElement> | string
  ) => {
    const newValue =
      typeof eventOrString === "string"
        ? eventOrString
        : eventOrString.currentTarget.value;
    newValue ? openResultsList(newValue) : closeResultsList();
    setLastInputtedValue(newValue);
    prevAbortControllerRef.current.abort("intended");
    const abortController = new AbortController();
    prevAbortControllerRef.current = abortController;
    const signal = abortController.signal;
    setValue(newValue);
    clearRelatedSearches();
    rateLimitedGetAndSetRelatedSearches(newValue, signal);
  };

  const openLinkCloseListRefocusInputAndModifyInput = (openLink = true) => {
    if (openLink) openHoveredLink();
    handleOnChange(value);
    if (inputRef.current) inputRef.current.focus();
    closeResultsList();
  };

  const handleSearchResultClick = () =>
    openLinkCloseListRefocusInputAndModifyInput(false);

  const setHoveredAndUpdateValue = (
    newHovered: number | ((prevHovered: number) => number)
  ) => {
    const computedHovered =
      typeof newHovered === "number" ? newHovered : newHovered(hovered);
    const hoveredElement =
      searchResultsContainerRef.current?.children?.item(computedHovered);
    if (
      hoveredElement instanceof HTMLElement &&
      hoveredElement.dataset.relatedString
    ) {
      setHovered(computedHovered);
      setValue(hoveredElement.dataset.relatedString);
    }
  };

  const increaseHovered = () =>
    setHoveredAndUpdateValue((prevHovered) =>
      prevHovered < relatedSearchesLength - 1 ? prevHovered + 1 : 0
    );

  const decreaseHovered = () =>
    setHoveredAndUpdateValue((prevHovered) =>
      prevHovered > 0 ? prevHovered - 1 : relatedSearchesLength - 1
    );

  const setHoveredToLast = () =>
    setHoveredAndUpdateValue(relatedSearchesLength - 1);

  const arrowNavHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        openResultsList();
        increaseHovered();
        break;
      case "ArrowUp":
        event.preventDefault();
        openResultsList();
        decreaseHovered();
        break;
      case "ArrowLeft":
      case "ArrowRight":
        setHovered(-1);
        break;
      case "Home":
        setHoveredAndUpdateValue(0);
        break;
      case "End":
        setHoveredToLast();
        break;
      case "Enter":
        if (document.activeElement === inputRef.current)
          openLinkCloseListRefocusInputAndModifyInput();
        break;
      case "Escape":
        closeResultsList();
        break;
    }
  };

  const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.dataset.index) {
      setHoveredAndUpdateValue(+event.target.dataset.index);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      !(event.relatedTarget instanceof HTMLElement) ||
      !event.relatedTarget.dataset.combobox
    )
      closeResultsList();
  };

  const clearInput = () => {
    handleOnChange("");
  };

  return (
    <div
      className="combobox"
      data-open={visibleResultsList}
      onKeyDown={arrowNavHandler}
      onBlur={handleBlur}
    >
      <div className="inputContainer">
        <input
          id="input"
          type="text"
          ref={inputRef}
          value={value}
          onChange={handleOnChange}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={visibleResultsList}
          aria-controls="listbox"
          data-combobox
        />
        <button
          className="clearInputButton"
          type="button"
          onClick={clearInput}
          data-combobox
        >
          x
        </button>
      </div>
      <ResultList
        relatedSearches={relatedSearches}
        hovered={hovered}
        lastInputtedValue={lastInputtedValue}
        hoverHandler={hoverHandler}
        handleSearchResultClick={handleSearchResultClick}
        ref={searchResultsContainerRef}
      />
    </div>
  );
};
