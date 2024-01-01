import * as React from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  MapProvider,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useViewState } from "./mapox-view-state.provider";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

type MapboxMapProps = { children: React.ReactNode };

export const MapboxMap = ({ children }: MapboxMapProps) => {
  const { state: viewState, onChange: onMove } = useViewState();

  return (
    <MapProvider>
      <Map
        {...viewState}
        onMove={onMove}
        mapLib={import("mapbox-gl")}
        id="warsawTreesMap"
        mapStyle="mapbox://styles/maciejreimann/cjlc8kpy065v32rs0f0e1pctw"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {children}

        <GeolocateControl />
        <FullscreenControl />
        <NavigationControl />
      </Map>
    </MapProvider>
  );
};
