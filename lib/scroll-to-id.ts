export function scrollToId(id: string, timeout = 0, offset = 0) {
  setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const modal = document.querySelector('div[role="dialog"]') as HTMLElement;
      if (modal) {
        const modalScrollTop = modal.scrollTop;
        modal.scrollTo({ top: elementPosition - modal.offsetTop + modalScrollTop + offset, behavior: "smooth" });
      } else {
        window.scrollTo({ top: elementPosition + offset, behavior: "smooth" });
      }
    }
  }, timeout);
}
