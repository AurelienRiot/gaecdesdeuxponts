export function scrollToId(id: string, timeout = 0, offset = 0, behavior: ScrollBehavior = "smooth") {
  setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const windowScrollY = window.scrollY;
      const modal = document.querySelector('div[role="dialog"]') as HTMLElement;

      if (modal) {
        const modalScrollTop = modal.scrollTop;
        modal.scrollTo({ top: elementPosition + windowScrollY - modal.offsetTop + modalScrollTop + offset, behavior });
        return;
      }
      window.scrollTo({ top: elementPosition + windowScrollY + offset, behavior });
    }
  }, timeout);
}
