import type { FeatureCollection } from "geojson";

import { MapboxGeojsonSource } from "../libs/mapbox-geojson-source";
import {
  useTreesTotal,
  useTrees,
  useTreeById,
  useTreeSpecies,
} from "./use.trees";

type TreesGeojsonSourcesProps = {
  limitPerRequest?: number;
};

export const TreesGeojsonSources = ({
  limitPerRequest = 20_000,
}: TreesGeojsonSourcesProps) => {
  const { data: totalNumberOfTrees } = useTreesTotal();
  const results = useTrees({
    limitPerRequest,
    total: totalNumberOfTrees,
  });

  return results.map((result, index) => {
    if (!result.data) return null;

    const geojson = toGeoJSON(result.data);

    return (
      <MapboxGeojsonSource
        key={String(index)}
        id={String(index)}
        geojson={geojson}
        renderPopupContent={(id) => (
          <>
            <TreeDetails id={id} />
          </>
        )}
      />
    );
  });
};

interface TreeDetailsProps {
  id: string;
}

const TreeDetails = ({ id }: TreeDetailsProps) => {
  const { data, isLoading } = useTreeById({ id });

  if (isLoading) return <>Loading...</>;

  const details = JSON.stringify(data, null, 2);

  return <>{details}</>;
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

export const FiltersPanel = () => {
  const limitPerRequest = 20_000;

  const { data: totalNumberOfTrees } = useTreesTotal();

  const queriesResults = useTreeSpecies({
    limitPerRequest,
    total: totalNumberOfTrees,
  });

  return (
    <div style={{ position: "absolute", top: 100 }}>
      Filter by species
      <>
        {queriesResults.map((result, index) => {
          return <div key={index}>{result.data}</div>;
        })}
      </>
    </div>
  );
};
