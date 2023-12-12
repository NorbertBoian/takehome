export const getThrottledAndDebouncedFunction = <
  F extends (...args: Parameters<F>) => ReturnType<F>
>(
  fn: F,
  delay: number
) => {
  let nextTick: undefined | NodeJS.Timeout = undefined;
  let timeout: undefined | NodeJS.Timeout = undefined;
  const throttledAndDebounced = (...args: Parameters<F>) => {
    const tick = () => {
      fn(...args);
      nextTick = undefined;
    };
    const later = () => fn(...args);
    if (!nextTick) {
      nextTick = setTimeout(tick, delay);
    }
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
  return throttledAndDebounced;
};
