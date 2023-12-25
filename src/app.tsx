import { MapboxMap, ViewStateProvider } from "./libs/mapbox-map";
import { TreesGeojsonSources } from "./trees/geojson-sources";

export const App = () => {
  return (
    <ViewStateProvider>
      <MapboxMap>
        <TreesGeojsonSources />
      </MapboxMap>
    </ViewStateProvider>
  );
};
