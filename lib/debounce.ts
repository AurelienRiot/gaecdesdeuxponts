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
