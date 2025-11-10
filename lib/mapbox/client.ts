import mapboxgl from "mapbox-gl";

export function initMapbox() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    console.warn("Mapbox token not found");
    return null;
  }
  mapboxgl.accessToken = token;
  return mapboxgl;
}

export interface RoutePoint {
  name: string;
  coordinates: [number, number];
}

export const demoRoutes: RoutePoint[] = [
  {
    name: "Miami Beach Marina",
    coordinates: [-80.1319, 25.7907],
  },
  {
    name: "Bayside Marketplace",
    coordinates: [-80.1877, 25.7784],
  },
];

