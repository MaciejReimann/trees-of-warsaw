import * as React from "react";
import axios from "axios";
import Map, {
  Source,
  Layer,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type { FeatureCollection } from "geojson";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const layerStyle: CircleLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 2,
    "circle-color": "red",
  },
};

export const App = () => {
  const [data, setData] = React.useState<any>(undefined);

  React.useEffect(() => {
    const fetchData = async () => {
      const baseURL = "http://localhost:8088";
      const url = `${baseURL}/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`;

      const limit = 1000;
      const urlWithLimit = `${url}&limit=${limit}`;

      const res = await axios({
        method: "get",
        url: urlWithLimit,
      });

      const records = res.data.result.records;

      setData(records);
    };

    fetchData();
  }, []);

  const geojson = React.useMemo(() => {
    if (!data) return undefined;

    const geojson = toGeoJSON(data);
    return geojson;
  }, [data]);

  console.log("data", data);

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
      {geojson && (
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      )}

      <GeolocateControl />
      <FullscreenControl />
      <NavigationControl />
    </Map>
  );
};

const toGeoJSON = (
  items: { x_wgs84: number; y_wgs84: number }[],
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: items.map((item) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [item.x_wgs84, item.y_wgs84] },
      properties: { ...item },
    })),
  };
};
