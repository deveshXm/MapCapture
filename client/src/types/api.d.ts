declare namespace ApiTypes {
  interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
  }

  interface SaveMapDataParams {
    center: [number, number];
    zoom: number;
    capturedImage: string;
  }
}
