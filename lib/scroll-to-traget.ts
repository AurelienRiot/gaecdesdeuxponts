export function ScrollToTarget(target: string, offset = 0) {
  const element = document.getElementById(target);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementPosition + offset, behavior: "smooth" });
  }
}
