import { MapboxGeojsonSource } from "../libs/mapbox-geojson-source";
import { useTreesTotal, useTreesGeoJSON, useTreeById } from "./use.trees";

type TreesGeojsonSourcesProps = {
  limitPerRequest?: number;
};

export const TreesGeojsonSources = ({
  limitPerRequest = 20_000,
}: TreesGeojsonSourcesProps) => {
  const { data: totalNumberOfTrees } = useTreesTotal();

  const results = useTreesGeoJSON({
    limitPerRequest,
    total: totalNumberOfTrees ?? 0,
  });

  return results.map((result, index) => {
    if (!result.isSuccess) return null;

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
  const { data, isLoading } = useTreeById(id);

  if (isLoading) return <>Loading...</>;

  const details = JSON.stringify(data, null, 2);

  return <>{details}</>;
};
