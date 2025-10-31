export class ZoneHelper {
  static formatCoordinates(coordinates: number[][]): { lat: number; lng: number }[] {
    // MongoDB stores as [lng, lat], so convert to { lat, lng }
    return coordinates.map(([lng, lat]) => ({ lat, lng }));
  }
}