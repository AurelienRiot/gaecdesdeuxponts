const scrollToLastChild = (containerRef: React.RefObject<HTMLElement>) => {
  setTimeout(() => {
    containerRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, 10);
};

export default scrollToLastChild;
