export const logDebugData = (name = "", data: unknown): boolean => {
  const debugMode = process.env.VUE_APP_DEBUG_MODE;
  if (debugMode == "1") {
    console.log(name, data);
  }
  return true;
};

export const scrollTop = (element: HTMLElement) => {
  if (element?.scrollTo) {
    element.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
};

export default { logDebugData, scrollTop };
