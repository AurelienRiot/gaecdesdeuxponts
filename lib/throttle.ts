// throttle.ts
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
