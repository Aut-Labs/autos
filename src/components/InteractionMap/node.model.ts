import { MapAutID } from "@api/models/map.model";

export class MapNode extends MapAutID {
  pl: number;
  size: number;
  color: string;
  x: number;
  y: number;

  constructor(data: MapNode) {
    super(data);
    this.pl = data.pl;
    this.size = data.size;
    this.color = data.color;
    this.x = data.x;
    this.y = data.y;
  }
}

export interface MapLink {
  is: number;
}
