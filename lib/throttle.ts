/**
 * Creates a throttled function that only invokes the provided function at most once
 * per every specified limit of milliseconds.
 *
 * @param func - The function to throttle.
 * @param limit - The number of milliseconds to wait before allowing the function to be called again.
 * @returns A new throttled function.
 */
export default function throttle<F extends (...args: any[]) => void>(func: F, limit: number) {
  let inThrottle = false;

  return (...args: Parameters<F>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
