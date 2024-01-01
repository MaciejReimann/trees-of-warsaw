import * as React from "react";
import { Source, SourceProps, Layer, useMap, Popup } from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";

import { useViewState } from "./mapox-view-state.provider";

const layerStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 1,
    "circle-color": "red",
  },
};

type MapboxGeojsonSourceProps = Omit<SourceProps, "type"> & {
  id: string;
  geojson?: FeatureCollection;
  renderPopupContent: (featureId: string) => React.ReactNode;
};

export const MapboxGeojsonSource = ({
  id,
  geojson,
  renderPopupContent,
}: MapboxGeojsonSourceProps) => {
  const { state: viewState } = useViewState();

  const [popupCoordinates, setPopupCoordinates] = React.useState<
    { lng: number; lat: number } | undefined
  >(undefined);
  const [featureId, setFeatureId] = React.useState<string | undefined>();

  const { warsawTreesMap } = useMap();
  React.useEffect(() => {
    if (!warsawTreesMap || !geojson) return;

    warsawTreesMap.on("mouseenter", id, function (e) {
      warsawTreesMap.getCanvas().style.cursor = "default";

      setPopupCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });

      const features = warsawTreesMap.queryRenderedFeatures(e.point);
      const featureId = features[0].properties?._id;
      setFeatureId(featureId);
    });

    warsawTreesMap.on("mouseleave", id, function () {
      warsawTreesMap.getCanvas().style.cursor = "";

      setPopupCoordinates(undefined);
      setFeatureId(undefined);
    });
  }, [warsawTreesMap, id, geojson, featureId]);

  return (
    <Source id={id} type="geojson" data={geojson}>
      <Layer
        {...layerStyle}
        paint={{ "circle-radius": getCircleRadius(viewState.zoom) }}
        id={id}
      />

      {popupCoordinates && (
        <Popup
          longitude={popupCoordinates.lng}
          latitude={popupCoordinates.lat}
          anchor="bottom"
          onClose={() => setPopupCoordinates(undefined)}
        >
          You are here
          {featureId && renderPopupContent(featureId)}
        </Popup>
      )}
    </Source>
  );
};

const getCircleRadius = (zoom: number) => {
  if (zoom < 12) return 1;
  if (zoom < 14) return 2;
  if (zoom < 16) return 4;
  if (zoom < 18) return 8;
  if (zoom < 20) return 16;
  return 32;
};
