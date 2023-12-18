import { MapboxMap } from "./libs/mapbox-map";
import { TreesGeojsonSources } from "./trees/geojson-sources";

export const App = () => {
  return (
    <MapboxMap>
      <TreesGeojsonSources />
    </MapboxMap>
  );
};
