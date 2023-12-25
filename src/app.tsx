import { MapboxMap } from "./libs/mapbox-map";
import { ViewStateProvider } from "./libs/mapox-view-state.provider";
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
