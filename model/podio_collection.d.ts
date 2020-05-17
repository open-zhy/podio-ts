import { PodioObjectIO } from "./podio_object.d.ts";

export type PodioCollectionIO = {
  filtered: number;
  total: number;
  items: PodioObjectIO[];
};
