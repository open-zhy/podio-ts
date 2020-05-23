interface Splitable {
  split(s: string): string[],
}

/**
 * Get value through an object or object
 * 
 * @param data 
 * @param key 
 * @param defaultValue 
 */
export function getValue<T, K extends keyof T, D> (
  data: T,
  key: K,
  defaultValue?: D,
): T[K] | D | undefined {
  let r: any = data;
  const path = (key as Splitable).split(".");

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

  return r as T[K] | D | undefined;
};
