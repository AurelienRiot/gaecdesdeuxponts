/**
 * Creates a debounced function that delays invoking the provided function until after
 * a specified wait time has elapsed since the last time the debounced function was called.
 *
 * @param func - The function to debounce.
 * @param waitFor - The number of milliseconds to delay.
 * @returns A new debounced function with a cancel method to clear the timeout.
 */
export function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };

  // Optional: Add a cancel method to clear the timeout
  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
}
