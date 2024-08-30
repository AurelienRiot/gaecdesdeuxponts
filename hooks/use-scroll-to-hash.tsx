import { useEffect } from "react";

const useScrollToHashOnMount = () => {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const hash = url.split("#")[1];
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Run the scroll handler on initial load
    const path = typeof window !== "undefined" && window.location.href ? window.location.href : "";
    if (path.includes("#")) {
      handleRouteChange(path);
    }
  }, []);
};

export default useScrollToHashOnMount;
