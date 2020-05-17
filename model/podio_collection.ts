import { PodioObject } from "./podio_object.ts";

export class PodioCollection {
  public filtered: number;
  public total: number;
  public items: PodioObject[];

  constructor({ filtered, total, items }: any) {
    this.filtered = filtered;
    this.total = total;
    this.items = items;
  }
}
