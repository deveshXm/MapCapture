declare namespace MapTypes {
  type Annotation = { latitude: number; longitude: number; note: string } | null;
  interface MapState {
    center: [number, number];
    zoom: number;
    capturedImage: string | null;
    savedMaps: MapData[];
    annotation: Annotation;
  }

  interface MapData {
    _id: string;
    center: [number, number];
    zoom: number;
    capturedImage: string;
    createdAt: string;
    annotation: Annotation;
  }

  interface TopRegion {
    region: string;
    count: number;
  }
}
