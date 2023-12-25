import * as React from "react";
import Map, {
  Source,
  SourceProps,
  Layer,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  MapProvider,
  useMap,
  ViewStateChangeEvent,
} from "react-map-gl";
import type { CircleLayer, ViewState } from "react-map-gl";
import type { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const layerStyle: Omit<CircleLayer, "id"> = {
  type: "circle",
  paint: {
    "circle-radius": 1,
    "circle-color": "red",
  },
};

type MapboxMapProps = { children: React.ReactNode };

export const MapboxMap = ({ children }: MapboxMapProps) => {
  const { state: viewState, onChange: onMove } = useViewState();

  return (
    <MapProvider>
      <Map
        {...viewState}
        onMove={onMove}
        mapLib={import("mapbox-gl")}
        id="warsaw-trees-map"
        style={{ height: "100vh", width: "100wh" }}
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

type MapboxGeojsonSourceProps = Omit<SourceProps, "type"> & {
  id: string;
  geojson?: FeatureCollection;
};

export const MapboxGeojsonSource = ({
  id,
  geojson,
}: MapboxGeojsonSourceProps) => {
  const { state: viewState, onChange: onMove } = useViewState();

  React.useEffect(() => {
    // console.log("MapboxGeojsonSource", viewState.zoom);
  }, [viewState.zoom]);

  return (
    <Source id={id} type="geojson" data={geojson}>
      <Layer
        {...layerStyle}
        paint={{ "circle-radius": getCircleRadius(viewState.zoom) }}
        id={id}
      />
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

export const ViewStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewState, setViewState] = React.useState({
    longitude: 21,
    latitude: 52.23,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const onMove = React.useCallback(({ viewState }: ViewStateChangeEvent) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    // Only update the view state if the center is inside the geofence
    // if (turf.booleanPointInPolygon(newCenter, GEOFENCE)) {
    //   setViewState(newCenter);
    // }
    setViewState(viewState);
    // console.log("viewState", viewState);
  }, []);

  return (
    <ViewStateContext.Provider value={{ state: viewState, onChange: onMove }}>
      {children}
    </ViewStateContext.Provider>
  );
};

const ViewStateContext = React.createContext<
  { state: ViewState; onChange: (e: ViewStateChangeEvent) => void } | undefined
>(undefined);

function useViewState() {
  const context = React.useContext(ViewStateContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}
