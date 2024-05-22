export const useLocalStorage = (key: "cookies-banner") => {
  const getValue = () => {
    try {
      if (typeof window === "undefined") {
        return undefined;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const setValue = (value: object) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { getValue, setValue, removeValue };
};
