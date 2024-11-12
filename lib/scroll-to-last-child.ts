const scrollToLastChild = (element?: HTMLElement | null) => {
  setTimeout(() => {
    element?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, 10);
};

export default scrollToLastChild;
