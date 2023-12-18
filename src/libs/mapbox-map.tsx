import Map, {
  Source,
  SourceProps,
  Layer,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const layerStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "red",
  },
};

type MapboxMapProps = { children: React.ReactNode };

export const MapboxMap = ({ children }: MapboxMapProps) => {
  return (
    <Map
      mapLib={import("mapbox-gl")}
      initialViewState={{
        longitude: 21,
        latitude: 52.23,
        zoom: 10,
      }}
      style={{ height: "100vh", width: "100wh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {children}

      <GeolocateControl />
      <FullscreenControl />
      <NavigationControl />
    </Map>
  );
};

type MapboxGeojsonSourceProps = Omit<SourceProps, "type"> & {
  id: string;
  geojson?: FeatureCollection;
};

export const MapboxGeojsonSource = ({
  id,
  geojson,
}: MapboxGeojsonSourceProps) => {
  return (
    <Source id={id} type="geojson" data={geojson}>
      <Layer {...layerStyle} id={id} />
    </Source>
  );
};
