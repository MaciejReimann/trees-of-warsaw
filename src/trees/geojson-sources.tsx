import { MapboxGeojsonSource } from "../libs/mapbox-geojson-source";
import {
  useTreesTotal,
  useTreesGeoJSON,
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

  const results = useTreesGeoJSON({
    limitPerRequest,
    total: totalNumberOfTrees,
  });

  return results.map((result, index) => {
    if (!result.data) return null;

    return (
      <MapboxGeojsonSource
        key={String(index)}
        id={String(index)}
        geojson={result.data}
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
