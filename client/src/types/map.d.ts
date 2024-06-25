declare namespace MapTypes {
  interface MapState {
    center: [number, number];
    zoom: number;
    capturedImage: string | null;
    savedMaps: MapData[];
    annotation: string;
  }

  interface MapData {
    _id: string;
    center: [number, number];
    zoom: number;
    capturedImage: string;
    createdAt: string;
    annotation: string;
  }

  interface TopRegion {
    region: string;
    count: number;
  }
}
