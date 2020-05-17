/**
 * Get value through an object or object
 * 
 * @param data 
 * @param key 
 * @param defaultValue 
 */
export const getValue = (
  data: any,
  key: string,
  defaultValue: any = undefined,
): any => {
  let r = data;
  const path = key.split(".");

  path.some(
    (k: string): boolean => {
      if (typeof r[k] === "undefined") {
        r = defaultValue;
        return true;
      }

      r = r[k];
      return false;
    },
  );

  return r;
};
